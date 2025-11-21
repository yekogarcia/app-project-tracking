/* 
  Ejemplos de FormProvider con control real de ancho
  
  ANTES (problema):
  - size="lg" → width: "100%", maxWidth: "600px"
  - Siempre toma el 100% del padre, limitado a 600px
  - No permite control real del porcentaje de pantalla

  AHORA (solucionado):
  - size="lg" → width: "600px" (ancho fijo)
  - size="half" → width: "50vw" (50% de la pantalla)
  - width="30vw" → 30% de la pantalla
  - width="80%" → 80% del contenedor padre
*/

// ✅ CORRECTO: 50% de la pantalla
<FormProvider 
  form={form} 
  onSubmit={onSubmit}
  size="half"
  centered
>

// ✅ CORRECTO: 30% de la pantalla
<FormProvider 
  form={form} 
  onSubmit={onSubmit}
  width="30vw"
  centered
>

// ✅ CORRECTO: 80% del contenedor padre
<FormProvider 
  form={form} 
  onSubmit={onSubmit}
  width="80%"
>

// ✅ CORRECTO: Responsive - diferentes anchos por breakpoint
<FormProvider 
  form={form} 
  onSubmit={onSubmit}
  width={{ base: "90vw", md: "60vw", lg: "40vw" }}
  centered
>

// ✅ CORRECTO: Ancho fijo de 600px
<FormProvider 
  form={form} 
  onSubmit={onSubmit}
  size="lg"
  centered
>

// ✅ CORRECTO: Ancho personalizado con límite
<FormProvider 
  form={form} 
  onSubmit={onSubmit}
  width="70vw"
  maxWidth="800px"
  centered
>

/* 
  TAMAÑOS DISPONIBLES:
  
  size="sm"       → width: "300px"    (ancho fijo pequeño)
  size="md"       → width: "400px"    (ancho fijo mediano)  
  size="lg"       → width: "600px"    (ancho fijo grande)
  size="xl"       → width: "800px"    (ancho fijo extra grande)
  size="full"     → width: "100vw"    (pantalla completa)
  size="container"→ width: "100%"     (contenedor completo)
  size="half"     → width: "50vw"     (50% de pantalla)
  size="quarter"  → width: "25vw"     (25% de pantalla)
  size="auto"     → sin width         (automático)
*/