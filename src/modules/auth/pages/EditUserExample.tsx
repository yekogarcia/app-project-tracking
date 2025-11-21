import { RegisterForm } from "../components/RegisterForm";

/**
 * 🎯 Ejemplo de uso del RegisterForm para EDITAR un registro
 * 
 * Este componente muestra cómo usar el RegisterForm existente
 * para pre-llenar campos cuando necesitas editar datos.
 */
export function EditUserExample() {
  // 📊 Simulamos datos de un usuario existente
  const existingUserData = {
    type: "PERSONAL" as const,
    name: "Juan Pérez",
    email: "juan.perez@email.com",
    phone: 3001234567,
    address: "Calle 123 #45-67, Bogotá"
    // ⚠️ NO incluir password/confirmPassword para edición
  };

  const handleSwitchToLogin = () => {
    console.log("Cambiar a login");
  };

  return (
    <div>
      <h2>Editar Usuario</h2>
      
      {/* 🎯 El mismo RegisterForm, pero con valores iniciales */}
      <RegisterForm 
        onSwitchToLogin={handleSwitchToLogin}
        defaultValues={existingUserData}
        mode="edit"
      />
    </div>
  );
}