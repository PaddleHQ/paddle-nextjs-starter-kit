export function FormError({ message }: { message?: string }) {
  return (
    <p role="alert" className="min-h-5 w-full max-w-sm text-center text-sm text-red-400">
      {message}
    </p>
  );
}
