export function LoginCardGradient() {
  return (
    <>
      <div className={'login-background-base login-card-hard-blur'} />
      <div className={'login-background-base login-card-vertical-hard-blur'} />
      <div
        className={
          'login-background-base login-card-small-soft-blur md:login-card-medium-soft-blur login-card-soft-blur'
        }
      />
      <div
        className={
          'login-background-base login-card-yellow-highlight login-card-small-yellow-highlight md:login-card-medium-yellow-highlight'
        }
      />
    </>
  );
}
