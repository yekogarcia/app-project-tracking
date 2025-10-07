import { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthLayout
      title={isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
      subtitle={
        isLogin
          ? 'Accede a tu cuenta para continuar'
          : 'Únete a nosotros y comienza tu experiencia'
      }
    >
      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </AuthLayout>
  );
}