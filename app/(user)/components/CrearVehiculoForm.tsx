"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  X,
  ImagePlus,
  Fuel,
  Car,
  Info,
  Phone,
  MapPin,
  Settings,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Stepper } from "@/components/ui/stepper";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function PublicarVehiculoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);

  // Datos del formulario
  const [formData, setFormData] = useState({
    matricula: "",
    marca: "",
    generacion: "",
    año: "",
    tipoVehiculo: "",
    vin: "",
    modelo: "",
    kilometraje: "",
    combustible: "",
    potencia: "",
    emisiones: "",
    numeroPuertas: "",
    colorExterior: "",
    estadoVehiculo: "",
    libroMantenimiento: "",
    accidentesPrevios: "",
    numeroDuchas: "",
    itvRevision: "",
    colorInterior: "",
    precio: "",
    descripcion: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const equipamientoOptions = [
    "Aire acondicionado / climatizador", "Pontón total", "Sistema multimedia",
    "Cámara / sensores", "Bluetooth", "Aislamiento de frenado de emergencia",
    "Director de fatiga", "Alerta de cambio de canal", "Asistente de mantenimiento de canal",
    "Apple CarPlay / Android Auto", "Cargador inalámbrico", "USB / USB-C",
    "Sistema de sonido premium", "Head-Up Display", "Faros", "Líneas de dirección (tramo)",
    "Espejos eléctricos", "Espejos abatibles", "Valiosos tintados", "Suspensión adaptativa",
    "Dirección asistida eléctrica", "Start & Stop", "Navegador GPS integrado",
    "Control de estabilidad (ESP)", "Control de tracción", "Airbags",
    "Control de crucero adaptativo (ACC)", "Sensor de punto ciego", "Cámara 360°",
    "Sensores de estacionamiento", "Control por voz", "Volante multifunción",
    "Aire que se llave (Keyless)", "Elevadores eléctricos", "Iluminación ambiental",
    "Luces diurnas LED", "Tracción (AWD, 4x4, etc.)", "Control de descenso",
    "Asientos de tela / cuero / mixto", "Asientos eléctricos", "Asientos Calefactables",
    "Asientos Ventilados", "Climatizador"
  ];

  const [selectedEquipamiento, setSelectedEquipamiento] = useState<string[]>([]);

  const toggleEquipamiento = (item: string) => {
    setSelectedEquipamiento(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const steps = [
    { id: 1, name: "Datos del vehículo" },
    { id: 2, name: "Características técnicas" },
    { id: 3, name: "Equipamiento" },
    { id: 4, name: "Precio" },
    { id: 5, name: "Recursos multimedia" },
    { id: 6, name: "Resumen y publicación" },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Autocompletar anuncio con IA */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100">
              <h3 className="font-semibold text-gray-900 mb-2">Autocompletar anuncio con IA</h3>
              <p className="text-sm text-gray-600 mb-3">Ingresa la matrícula y completa automáticamente los datos</p>
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Ingresa el número de matrícula *"
                  className="flex-1 border-gray-300"
                />
                <Button className="bg-purple-600 hover:bg-purple-700">
  Buscar
                </Button>
              </div>
            </div>

            {/* Formulario datos vehículo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="mb-1">Matrícula *</Label>
                <Input type="text" placeholder="Ingresa el número de matrícula *" className="border-gray-300" />
              </div>
               <div>
                <Label className="mb-1">VIN *</Label>
                <Input type="text" placeholder="Ingresa el VIN *" className="border-gray-300" />
              </div>
              <div>
                <Label className="mb-1">Marca *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona *" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toyota">Toyota</SelectItem>
                    <SelectItem value="volkswagen">Volkswagen</SelectItem>
                    <SelectItem value="chevrolet">Chevrolet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                 <div>
                <Label className="mb-1">Modelo *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona *" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corolla">Corolla</SelectItem>
                    <SelectItem value="polo">Polo</SelectItem>
                    <SelectItem value="trailblazer">Trailblazer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1">Generación *</Label>
                <Input type="text" placeholder="Ingresa el año *" className="border-gray-300" />
              </div>

              <div>
                <Label className="mb-1">Año *</Label>
                <Input type="text" placeholder="Ingresa *" className="border-gray-300" />
              </div>
               <div>
                <Label className="mb-1">Vercion*</Label>
                <Input type="text" placeholder="Ingresa *" className="border-gray-300" />
              </div>
              <div>
                <Label className="mb-1">Kilometraje *</Label>
                <Input type="text" placeholder="Ingresa el kilometraje *" className="border-gray-300" />
              </div>
              <div>
                <Label className="mb-1">Tipo De Vehículo *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona *" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="sedan">Sedán</SelectItem>
                    <SelectItem value="hatchback">Hatchback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div>
                <Label className="mb-1">Tipo de *</Label>
                <Input type="text" placeholder="Ingresa *" className="border-gray-300" />
              </div>
             
           
              

            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="mb-1">Combustible</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gasolina">Gasolina</SelectItem>
                    <SelectItem value="diesel">Diésel</SelectItem>
                    <SelectItem value="electrico">Eléctrico</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1">Potencia</Label>
                <Input type="text" placeholder="SUV" className="border-gray-300" />
              </div>
              <div>
                <Label className="mb-1">Emisiones</Label>
                <Input type="text" placeholder="Ingreso" className="border-gray-300" />
              </div>
              <div>
                <Label className="mb-1">Número De Puertas</Label>
                <Input type="text" placeholder="2024" className="border-gray-300" />
              </div>
              <div>
                <Label className="mb-1">Color Exterior</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blanco">Blanco</SelectItem>
                    <SelectItem value="negro">Negro</SelectItem>
                    <SelectItem value="rojo">Rojo</SelectItem>
                    <SelectItem value="azul">Azul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Equipamiento y estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-6 border-b border-gray-200">
              <div>
                <Label className="mb-1">Estado Del Vehículo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selección" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nuevo">Nuevo</SelectItem>
                    <SelectItem value="usado">Usado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div>
                <Label className="mb-1">Número De Dueños</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selección" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                 <div>
                <Label className="mb-1">Libro De Mantenimiento</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selección" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
             <div>
                <Label className="mb-1">ITV / Revisión</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selección" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vigente">Vigente</SelectItem>
                    <SelectItem value="no-vigente">No vigente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1">Accidentes Previos</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selección" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ninguno">Ninguno</SelectItem>
                    <SelectItem value="uno">Uno</SelectItem>
                    <SelectItem value="dos-mas">Dos o más</SelectItem>
                  </SelectContent>
                </Select>
              </div>
             
            
              <div>
                <Label className="mb-1">Color Interior</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selección" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="negro">Negro</SelectItem>
                    <SelectItem value="beige">Beige</SelectItem>
                    <SelectItem value="gris">Gris</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lista de equipamiento */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Equipamiento:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto p-2">
                {equipamientoOptions.map((item) => (
                  <Label key={item} className="py-1.5 cursor-pointer">
                    <Checkbox
                      checked={selectedEquipamiento.includes(item)}
                      onCheckedChange={() => toggleEquipamiento(item)}
                    />
                    <span className="text-sm text-gray-600">{item}</span>
                  </Label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Precio sugerido */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">PRECIO SUGERIDO POR WIAUTO</h3>
              <p className="text-2xl font-bold text-blue-600">$24,800 – $28,200</p>
              <p className="text-xs text-gray-500 mt-1">Basado en 47 vehículos similares vendidos en los últimos 90 días.</p>
            </div>

            <div>
              <Label className="mb-1">Precio *</Label>
              <Input type="number" placeholder="Precio" className="border-gray-300" />
            </div>

            <div>
              <Label className="mb-1">Descripción *</Label>
              <textarea
                rows={5}
                placeholder="Cuenta lo mejor de tu auto"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-900 mb-3">Sube fotos de tu vehículo</h3>

            {/* Grid de 4x4 para fotos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                  <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  <Button
                    onClick={() => removeImage(i)}
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 bg-black/60 opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3 text-white" />
                  </Button>
                </div>
              ))}
              {Array.from({ length: Math.max(0, 16 - images.length) }).map((_, i) => (
                <Label key={`empty-${i}`} className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex-col items-center justify-center cursor-pointer hover:border-blue-400">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <ImagePlus className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Foto {images.length + i + 1}</span>
                </Label>
              ))}
            </div>
            <p className="text-xs text-gray-400">Sube hasta 16 fotos de tu vehículo</p>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            {/* Resumen de publicación */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">¡Casi listo!</h3>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-bold text-gray-900">Toyota Corolla 2020 Full 1.8</h4>
                <p className="text-2xl font-bold text-blue-600 mt-1">$28,900</p>
                <p className="text-green-600 text-sm">Financiamiento desde $482/mes - 60 meses</p>
                <p className="text-xs text-gray-500">IVA incluido</p>
              </div>

              <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              </p>
            </div>

            {/* NEW CHEVROLET Trailblazer */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">NEW CHEVROLET Trailblazer</p>
                  <p className="text-sm text-gray-500">A 0 mi | 18/100 | Manual</p>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div><span className="text-xs text-gray-500">Kilometraje</span><p className="text-sm font-medium">0 Km</p></div>
                    <div><span className="text-xs text-gray-500">Kilometraje</span><p className="text-sm font-medium">0 Km</p></div>
                    <div><span className="text-xs text-gray-500">Kilometraje</span><p className="text-sm font-medium">0 Km</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Button onClick={() => router.back()} variant="ghost" className="gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Regresar
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Stepper horizontal arriba */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
        </div>

        {/* Contenido principal */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {renderStep()}

          {/* Botones de navegación */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            <Button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              variant="outline"
            >
              Regresar
            </Button>
            {currentStep < 6 ? (
              <Button
                onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
              >
                Continuar
              </Button>
            ) : (
              <Button className="bg-green-600 hover:bg-green-700">
                Publicar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}