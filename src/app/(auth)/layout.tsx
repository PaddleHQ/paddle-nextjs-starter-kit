import "../login.css";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div>
      <div className="login-background-base login-gradient-background min-h-screen md:min-h-[919px]" />
      <div className="login-background-base grain-background min-h-screen md:min-h-[919px]" />
      <div className="login-background-base grid-bg min-h-screen md:min-h-[919px]" />
      {children}
    </div>
  );
}
