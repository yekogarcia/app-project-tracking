import { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

   const { isAuthenticated, account } = useAuthStore();

  if (isAuthenticated || account.id !== 0) {
    return <Navigate to="/admin" replace />;
  }

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