import FormLogin from "../sections/Login/FormLogin";

export function Login({ onLogin }) {
  return (
    <main className="bg-primary min-h-screen">
      <FormLogin onLogin={onLogin} />
    </main>
  );
}