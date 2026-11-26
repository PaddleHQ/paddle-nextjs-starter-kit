# Pricing and checkout

## Plans come from the catalog config

`pnpm seed` creates the plans defined in [`scripts/seed.mts`](../scripts/seed.mts) as products and prices in your Paddle account. It then writes their IDs to `src/catalog/catalog.json`. The app reads plans only from that file, through [`src/lib/catalog.ts`](../src/lib/catalog.ts).

- To change plans, edit `TIERS` in `scripts/seed.mts` and run `pnpm seed` again. It reuses matching products and prices. A changed USD amount creates a new price, so existing subscribers keep their current price.
- Each plan has fixed GBP and EUR prices for the countries in `LOCAL_MARKETS`, so UK and eurozone visitors see local prices even when automatic currency conversion is off. Everyone else sees USD, or a converted amount if your Paddle account has conversion on. Changing a GBP or EUR amount updates the existing price.
- `catalog.json` is gitignored because the IDs belong to your Paddle account. Run `pnpm seed` once per environment, and again after switching `NEXT_PUBLIC_PADDLE_ENV`. The app refuses to start if the file was seeded for the other environment.

## How a purchase flows

1. `/pricing` shows localised prices from Paddle.js `PricePreview`. Paddle detects the visitor's country from their IP address unless they pick one.
2. **Get started** calls the `startCheckout` server action ([`src/app/pricing/actions.ts`](../src/app/pricing/actions.ts)). It rejects any price that isn't in the catalog config.
   - **Signed out:** sends the visitor to `/signup?callbackURL=/pricing?checkout=<priceId>`. After sign-up they come back and checkout opens automatically.
   - **Signed in:** creates a Paddle transaction on the server with `customData.userId`. Paddle copies this to the subscription, so webhooks can link it to the user.
3. The client opens Paddle Checkout for that transaction, with the user's email filled in.
4. On success, Paddle redirects to `/checkout/success`. That page reads `getEntitlements(userId)` and refreshes every 2 seconds until the plan appears. It gives up after about a minute with a "taking longer than usual" message.

## Overlay checkout (default)

Checkout opens as an overlay on top of the pricing page. Defaults are set once when Paddle.js loads, in [`src/components/paddle/use-paddle.ts`](../src/components/paddle/use-paddle.ts):

```ts
checkout: { settings: { displayMode: "overlay", theme: "dark", variant: "one-page" } }
```

## Switching to inline checkout

Inline checkout embeds the form in your own page, so you can show an order summary next to it.

1. Add a page, for example `src/app/checkout/[priceId]/page.tsx`, with a container element: `<div className="checkout-container" />`.
2. Call `startCheckout(priceId)` from that page instead of from the pricing cards, then open checkout with inline settings:

   ```ts
   paddle.Checkout.open({
     transactionId,
     customer: { email },
     settings: {
       displayMode: "inline",
       frameTarget: "checkout-container", // class name of the container
       frameInitialHeight: 450,
       frameStyle: "width: 100%; min-width: 312px; background-color: transparent; border: none;",
       successUrl: new URL("/checkout/success", window.location.origin).href,
     },
   });
   ```

3. Point the pricing cards' **Get started** button at the new page.
4. To keep an order summary in sync, listen for `checkout.loaded` and `checkout.updated` in the `eventCallback` passed to `initializePaddle`.

See [Paddle's inline checkout guide](https://developer.paddle.com/build/checkout/build-branded-inline-checkout) for the full list of settings and events.
