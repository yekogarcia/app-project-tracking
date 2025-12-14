import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  Badge,
  HStack,
  VStack,
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  Input,
  Textarea,
  NativeSelectRoot,
  NativeSelectField,
  IconButton,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from "@chakra-ui/react";

import { useDisclosure } from "../../../app/hooks/useDisclosure";
import { 
  FiPlus, 
  FiMoreVertical, 
  FiEdit, 
  FiTrash2, 
  FiFolderPlus,
  FiCalendar,
  FiDollarSign,
  FiChevronDown,
  FiChevronRight 
} from "react-icons/fi";
import { useState } from "react";

interface Subproyecto {
  id: string;
  nombre: string;
  descripcion: string;
  progreso: number;
  presupuesto: number;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'completado' | 'pausado' | 'cancelado';
}

interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  progreso: number;
  presupuesto: number;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'completado' | 'pausado' | 'cancelado';
  cliente: string;
  subproyectos?: Subproyecto[];
}

const mockProyectos: Proyecto[] = [
  {
    id: '1',
    nombre: 'E-commerce Platform',
    descripcion: 'Desarrollo de plataforma de comercio electrónico completa',
    progreso: 75,
    presupuesto: 15000,
    fechaInicio: '2024-01-01',
    fechaFin: '2024-03-15',
    estado: 'activo',
    cliente: 'TechCorp',
    subproyectos: [
      {
        id: '1-1',
        nombre: 'Frontend',
        descripcion: 'Desarrollo del frontend con React',
        progreso: 80,
        presupuesto: 8000,
        fechaInicio: '2024-01-01',
        fechaFin: '2024-02-15',
        estado: 'activo'
      },
      {
        id: '1-2',
        nombre: 'Backend API',
        descripcion: 'API REST con Node.js',
        progreso: 70,
        presupuesto: 7000,
        fechaInicio: '2024-01-15',
        fechaFin: '2024-03-15',
        estado: 'activo'
      }
    ]
  },
  {
    id: '2',
    nombre: 'Mobile App',
    descripcion: 'Aplicación móvil para iOS y Android',
    progreso: 45,
    presupuesto: 12000,
    fechaInicio: '2024-01-15',
    fechaFin: '2024-04-30',
    estado: 'activo',
    cliente: 'StartupXYZ',
    subproyectos: [
      {
        id: '2-1',
        nombre: 'iOS App',
        descripcion: 'Aplicación nativa iOS',
        progreso: 50,
        presupuesto: 6000,
        fechaInicio: '2024-01-15',
        fechaFin: '2024-03-30',
        estado: 'activo'
      },
      {
        id: '2-2',
        nombre: 'Android App',
        descripcion: 'Aplicación nativa Android',
        progreso: 40,
        presupuesto: 6000,
        fechaInicio: '2024-01-15',
        fechaFin: '2024-04-30',
        estado: 'activo'
      }
    ]
  },
  {
    id: '3',
    nombre: 'Dashboard Analytics',
    descripcion: 'Dashboard de análisis y reportes en tiempo real',
    progreso: 90,
    presupuesto: 8000,
    fechaInicio: '2023-12-01',
    fechaFin: '2024-02-15',
    estado: 'activo',
    cliente: 'DataCorp',
    subproyectos: []
  },
];

export function ProyectosPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isSubOpen, onOpen: onSubOpen, onClose: onSubClose } = useDisclosure();
  const [proyectos, setProyectos] = useState<Proyecto[]>(mockProyectos);
  const [selectedProyecto, setSelectedProyecto] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    presupuesto: '',
    fechaInicio: '',
    fechaFin: '',
    cliente: '',
    estado: 'activo' as const
  });
  const [subFormData, setSubFormData] = useState({
    nombre: '',
    descripcion: '',
    presupuesto: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'activo' as const
  });

  const handleSubmit = () => {
    const nuevoProyecto: Proyecto = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      progreso: 0,
      presupuesto: parseFloat(formData.presupuesto),
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      estado: formData.estado,
      cliente: formData.cliente,
      subproyectos: []
    };

    setProyectos([nuevoProyecto, ...proyectos]);
    setFormData({ 
      nombre: '', 
      descripcion: '', 
      presupuesto: '', 
      fechaInicio: '', 
      fechaFin: '', 
      cliente: '', 
      estado: 'activo' 
    });
    onClose();
  };

  const handleSubproyectoSubmit = () => {
    if (!selectedProyecto) return;

    const nuevoSubproyecto: Subproyecto = {
      id: `${selectedProyecto}-${Date.now()}`,
      nombre: subFormData.nombre,
      descripcion: subFormData.descripcion,
      progreso: 0,
      presupuesto: parseFloat(subFormData.presupuesto),
      fechaInicio: subFormData.fechaInicio,
      fechaFin: subFormData.fechaFin,
      estado: subFormData.estado
    };

    setProyectos(proyectos.map(p => {
      if (p.id === selectedProyecto) {
        return {
          ...p,
          subproyectos: [...(p.subproyectos || []), nuevoSubproyecto]
        };
      }
      return p;
    }));

    setSubFormData({
      nombre: '',
      descripcion: '',
      presupuesto: '',
      fechaInicio: '',
      fechaFin: '',
      estado: 'activo'
    });
    onSubClose();
  };

  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      activo: 'blue',
      completado: 'green',
      pausado: 'yellow',
      cancelado: 'red'
    };
    return <Badge colorScheme={colors[estado as keyof typeof colors]}>{estado}</Badge>;
  };

  const getProgressColor = (progreso: number) => {
    if (progreso >= 80) return 'green';
    if (progreso >= 50) return 'blue';
    if (progreso >= 25) return 'yellow';
    return 'red';
  };

  const totalPresupuesto = proyectos.reduce((sum, proyecto) => sum + proyecto.presupuesto, 0);
  const proyectosActivos = proyectos.filter(p => p.estado === 'activo').length;

  return (
    <VStack gap="6" align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="start">
          <Box>
            <Heading size="lg" color="fg.emphasized">
              Proyectos
            </Heading>
            <Text color="fg.muted" mt="1">
              Gestiona todos tus proyectos y su progreso
            </Text>
          </Box>
          <DialogRoot open={isOpen} onOpenChange={({ open }) => open ? onOpen() : onClose()}>
            <DialogTrigger asChild>
              <Button colorScheme="blue">
                <FiPlus />
                Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent maxW="lg">
              <DialogHeader>
                <DialogTitle>Nuevo Proyecto</DialogTitle>
                <DialogCloseTrigger />
              </DialogHeader>
              <DialogBody>
                <VStack gap="4">
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="2">
                      Nombre del Proyecto
                    </Text>
                    <Input
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Nombre del proyecto"
                    />
                  </Box>
                  
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="2">
                      Descripción
                    </Text>
                    <Textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      placeholder="Descripción del proyecto"
                      rows={3}
                    />
                  </Box>

                  <Grid templateColumns="1fr 1fr" gap="4" w="full">
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb="2">
                        Cliente
                      </Text>
                      <Input
                        value={formData.cliente}
                        onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                        placeholder="Nombre del cliente"
                      />
                    </Box>
                    
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb="2">
                        Presupuesto
                      </Text>
                      <Input
                        type="number"
                        value={formData.presupuesto}
                        onChange={(e) => setFormData({...formData, presupuesto: e.target.value})}
                        placeholder="0.00"
                      />
                    </Box>
                  </Grid>

                  <Grid templateColumns="1fr 1fr" gap="4" w="full">
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb="2">
                        Fecha de Inicio
                      </Text>
                      <Input
                        type="date"
                        value={formData.fechaInicio}
                        onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                      />
                    </Box>
                    
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb="2">
                        Fecha de Fin
                      </Text>
                      <Input
                        type="date"
                        value={formData.fechaFin}
                        onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
                      />
                    </Box>
                  </Grid>
                  
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="2">
                      Estado
                    </Text>
                    <NativeSelectRoot>
                      <NativeSelectField
                        value={formData.estado}
                        onChange={(e) => setFormData({...formData, estado: e.target.value as any})}
                      >
                        <option value="activo">Activo</option>
                        <option value="pausado">Pausado</option>
                        <option value="completado">Completado</option>
                        <option value="cancelado">Cancelado</option>
                      </NativeSelectField>
                    </NativeSelectRoot>
                  </Box>
                </VStack>
              </DialogBody>
              
              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button colorScheme="blue" onClick={handleSubmit}>
                  Crear Proyecto
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </HStack>

        {/* Stats */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(3, 1fr)",
          }}
          gap="6"
        >
          <Box
            bg="bg.panel"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border.subtle"
            p="6"
          >
            <HStack>
              <FiFolderPlus size="24" color="blue" />
              <VStack align="start" gap="0">
                <Text fontSize="sm" color="fg.muted">Total Proyectos</Text>
                <Text fontSize="2xl" fontWeight="bold">{proyectos.length}</Text>
              </VStack>
            </HStack>
          </Box>
          
          <Box
            bg="bg.panel"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border.subtle"
            p="6"
          >
            <HStack>
              <FiCalendar size="24" color="green" />
              <VStack align="start" gap="0">
                <Text fontSize="sm" color="fg.muted">Proyectos Activos</Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {proyectosActivos}
                </Text>
              </VStack>
            </HStack>
          </Box>
          
          <Box
            bg="bg.panel"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border.subtle"
            p="6"
          >
            <HStack>
              <FiDollarSign size="24" color="purple" />
              <VStack align="start" gap="0">
                <Text fontSize="sm" color="fg.muted">Presupuesto Total</Text>
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                  ${totalPresupuesto.toLocaleString()}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </Grid>

        {/* Projects Grid */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap="6"
        >
          {proyectos.map((proyecto) => (
            <Box
              key={proyecto.id}
              bg="bg.panel"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="border.subtle"
              p="6"
            >
              <VStack align="stretch" gap="4">
                <HStack justify="space-between">
                  <Heading size="md" lineClamp={1}>
                    {proyecto.nombre}
                  </Heading>
                  <MenuRoot>
                    <MenuTrigger asChild>
                      <IconButton variant="ghost" size="sm">
                        <FiMoreVertical />
                      </IconButton>
                    </MenuTrigger>
                    <MenuContent>
                      <MenuItem value="add-sub" onClick={() => {
                        setSelectedProyecto(proyecto.id);
                        onSubOpen();
                      }}>
                        <FiPlus />
                        Agregar Subproyecto
                      </MenuItem>
                      <MenuItem value="edit">
                        <FiEdit />
                        Editar
                      </MenuItem>
                      <MenuItem value="delete" color="fg.error">
                        <FiTrash2 />
                        Eliminar
                      </MenuItem>
                    </MenuContent>
                  </MenuRoot>
                </HStack>

                <Text fontSize="sm" color="fg.muted" lineClamp={2}>
                  {proyecto.descripcion}
                </Text>

                <VStack align="stretch" gap="2">
                  <HStack justify="space-between">
                    <Text fontSize="sm" fontWeight="medium">Progreso</Text>
                    <Text fontSize="sm" fontWeight="bold">
                      {proyecto.progreso}%
                    </Text>
                  </HStack>
                  <Box
                    w="full"
                    bg="gray.200"
                    borderRadius="full"
                    h="2"
                    overflow="hidden"
                  >
                    <Box
                      h="full"
                      bg={`${getProgressColor(proyecto.progreso)}.500`}
                      w={`${proyecto.progreso}%`}
                      borderRadius="full"
                      transition="width 0.3s"
                    />
                  </Box>
                </VStack>

                <HStack justify="space-between">
                  <VStack align="start" gap="0">
                    <Text fontSize="xs" color="fg.muted">Cliente</Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {proyecto.cliente}
                    </Text>
                  </VStack>
                  <VStack align="end" gap="0">
                    <Text fontSize="xs" color="fg.muted">Presupuesto</Text>
                    <Text fontSize="sm" fontWeight="bold" color="green.500">
                      ${proyecto.presupuesto.toLocaleString()}
                    </Text>
                  </VStack>
                </HStack>

                <HStack justify="space-between">
                  <Text fontSize="xs" color="fg.muted">
                    {new Date(proyecto.fechaInicio).toLocaleDateString()} - {new Date(proyecto.fechaFin).toLocaleDateString()}
                  </Text>
                  {getEstadoBadge(proyecto.estado)}
                </HStack>

                {/* Subproyectos Section */}
                {proyecto.subproyectos && proyecto.subproyectos.length > 0 && (
                  <Box 
                    borderTopWidth="1px" 
                    borderColor="border.subtle" 
                    pt="3"
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleProjectExpansion(proyecto.id)}
                      width="full"
                      justifyContent="space-between"
                    >
                      <HStack>
                        <FiFolderPlus size="14" />
                        <Text fontSize="sm">
                          Subproyectos ({proyecto.subproyectos.length})
                        </Text>
                      </HStack>
                      {expandedProjects.has(proyecto.id) ? <FiChevronDown /> : <FiChevronRight />}
                    </Button>

                    {expandedProjects.has(proyecto.id) && (
                      <VStack align="stretch" gap="2" mt="2">
                        {proyecto.subproyectos.map((sub) => (
                          <Box
                            key={sub.id}
                            bg={{ base: "gray.50", _dark: "gray.700" }}
                            borderRadius="md"
                            p="3"
                          >
                            <VStack align="stretch" gap="2">
                              <HStack justify="space-between">
                                <Text fontSize="sm" fontWeight="medium">
                                  {sub.nombre}
                                </Text>
                                {getEstadoBadge(sub.estado)}
                              </HStack>
                              <Text fontSize="xs" color="fg.muted" lineClamp={1}>
                                {sub.descripcion}
                              </Text>
                              <HStack justify="space-between">
                                <Text fontSize="xs" color="fg.muted">
                                  Progreso: {sub.progreso}%
                                </Text>
                                <Text fontSize="xs" fontWeight="bold" color="green.500">
                                  ${sub.presupuesto.toLocaleString()}
                                </Text>
                              </HStack>
                            </VStack>
                          </Box>
                        ))}
                      </VStack>
                    )}
                  </Box>
                )}
              </VStack>
            </Box>
          ))}
        </Grid>

        {/* Dialog para crear subproyecto */}
        <DialogRoot open={isSubOpen} onOpenChange={({ open }) => open ? onSubOpen() : onSubClose()}>
          <DialogContent maxW="lg">
            <DialogHeader>
              <DialogTitle>Nuevo Subproyecto</DialogTitle>
              <DialogCloseTrigger />
            </DialogHeader>
            <DialogBody>
              <VStack gap="4">
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="2">
                    Nombre del Subproyecto
                  </Text>
                  <Input
                    value={subFormData.nombre}
                    onChange={(e) => setSubFormData({...subFormData, nombre: e.target.value})}
                    placeholder="Nombre del subproyecto"
                  />
                </Box>
                
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="2">
                    Descripción
                  </Text>
                  <Textarea
                    value={subFormData.descripcion}
                    onChange={(e) => setSubFormData({...subFormData, descripcion: e.target.value})}
                    placeholder="Descripción del subproyecto"
                    rows={3}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="2">
                    Presupuesto
                  </Text>
                  <Input
                    type="number"
                    value={subFormData.presupuesto}
                    onChange={(e) => setSubFormData({...subFormData, presupuesto: e.target.value})}
                    placeholder="0.00"
                  />
                </Box>

                <Grid templateColumns="1fr 1fr" gap="4" w="full">
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="2">
                      Fecha de Inicio
                    </Text>
                    <Input
                      type="date"
                      value={subFormData.fechaInicio}
                      onChange={(e) => setSubFormData({...subFormData, fechaInicio: e.target.value})}
                    />
                  </Box>
                  
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb="2">
                      Fecha de Fin
                    </Text>
                    <Input
                      type="date"
                      value={subFormData.fechaFin}
                      onChange={(e) => setSubFormData({...subFormData, fechaFin: e.target.value})}
                    />
                  </Box>
                </Grid>
                
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="2">
                    Estado
                  </Text>
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={subFormData.estado}
                      onChange={(e) => setSubFormData({...subFormData, estado: e.target.value as any})}
                    >
                      <option value="activo">Activo</option>
                      <option value="pausado">Pausado</option>
                      <option value="completado">Completado</option>
                      <option value="cancelado">Cancelado</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Box>
              </VStack>
            </DialogBody>
            
            <DialogFooter>
              <Button variant="outline" onClick={onSubClose}>
                Cancelar
              </Button>
              <Button colorScheme="blue" onClick={handleSubproyectoSubmit}>
                Crear Subproyecto
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </VStack>
  );
}