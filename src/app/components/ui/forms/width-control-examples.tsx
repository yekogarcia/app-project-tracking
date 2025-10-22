/*
  ENFOQUE CORRECTO: Control de ancho en FormProvider
  
  ✅ El AuthLayout mantiene su ancho al 100% 
  ✅ El FormProvider controla su propio ancho
  ✅ El card/contenedor se adapta al FormProvider
*/

// 1. Formulario que respeta el contenedor padre (recomendado para auth)
<FormProvider
  form={form}
  onSubmit={onSubmit}
  size="container"           // width: "100%" - respeta el padre
  display="flex"
  flexDirection="column"
  gap={4}
>

// 2. Formulario con ancho fijo y centrado (para formularios más anchos)
<FormProvider
  form={form}
  onSubmit={onSubmit}
  width="600px"             // Ancho fijo específico
  maxWidth="100%"           // Se ajusta en pantallas pequeñas
  mx="auto"                 // Centrado
  display="flex"
  flexDirection="column"
  gap={4}
>

// 3. Formulario responsive con breakpoints
<FormProvider
  form={form}
  onSubmit={onSubmit}
  width={{ base: "100%", md: "600px", lg: "800px" }}
  mx="auto"
  display="flex"
  flexDirection="column"
  gap={4}
>

// 4. Formulario que toma porcentaje específico del viewport
<FormProvider
  form={form}
  onSubmit={onSubmit}
  size="twoThirds"          // width: "67vw" - 67% de la pantalla
  maxWidth="900px"          // Límite máximo
  mx="auto"                 // Centrado
  display="flex"
  flexDirection="column"
  gap={4}
>

/*
  VENTAJAS DE ESTE ENFOQUE:
  
  1. AuthLayout permanece inalterado (width: 100%)
  2. FormProvider controla su propio ancho
  3. Cada formulario puede tener su ancho específico
  4. Responsive por defecto con maxWidth
  5. Centrado automático con mx="auto"
  6. No afecta otros componentes
*/