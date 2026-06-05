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
                <input
                  type="text"
                  placeholder="Ingresa el número de matrícula *"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                />
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
 Buscar
                </button>
              </div>
            </div>

            {/* Formulario datos vehículo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula *</label>
                <input type="text" placeholder="Ingresa el número de matrícula *" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VIN *</label>
                <input type="text" placeholder="Ingresa el VIN *" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option>Selecciona *</option>
                  <option>Toyota</option>
                  <option>Volkswagen</option>
                  <option>Chevrolet</option>
                </select>
              </div>
                 <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option>Selecciona *</option>
                  <option>Corolla</option>
                  <option>Polo</option>
                  <option>Trailblazer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Generación *</label>
                <input type="text" placeholder="Ingresa el año *" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Año *</label>
                <input type="text" placeholder="Ingresa *" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vercion*</label>
                <input type="text" placeholder="Ingresa *" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje *</label>
                <input type="text" placeholder="Ingresa el kilometraje *" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo De Vehículo *</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option>Selecciona *</option>
                  <option>SUV</option>
                  <option>Sedán</option>
                  <option>Hatchback</option>
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de *</label>
                <input type="text" placeholder="Ingresa *" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
             
           
              

            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Combustible</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option>Selecciona</option>
                  <option>Gasolina</option>
                  <option>Diésel</option>
                  <option>Eléctrico</option>
                  <option>Híbrido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Potencia</label>
                <input type="text" placeholder="SUV" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emisiones</label>
                <input type="text" placeholder="Ingreso" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número De Puertas</label>
                <input type="text" placeholder="2024" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color Exterior</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option>Selecciona</option>
                  <option>Blanco</option>
                  <option>Negro</option>
                  <option>Rojo</option>
                  <option>Azul</option>
                </select>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado Del Vehículo</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option>Selección</option>
                  <option>Nuevo</option>
                  <option>Usado</option>
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número De Dueños</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option>Selección</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
                 <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Libro De Mantenimiento</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option>Selección</option>
                  <option>Sí</option>
                  <option>No</option>
                </select>
              </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ITV / Revisión</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option>Selección</option>
                  <option>Vigente</option>
                  <option>No vigente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accidentes Previos</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option>Selección</option>
                  <option>Ninguno</option>
                  <option>Uno</option>
                  <option>Dos o más</option>
                </select>
              </div>
             
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color Interior</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option>Selección</option>
                  <option>Negro</option>
                  <option>Beige</option>
                  <option>Gris</option>
                </select>
              </div>
            </div>

            {/* Lista de equipamiento */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Equipamiento:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto p-2">
                {equipamientoOptions.map((item) => (
                  <label key={item} className="flex items-center gap-2 py-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEquipamiento.includes(item)}
                      onChange={() => toggleEquipamiento(item)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-sm text-gray-600">{item}</span>
                  </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
              <input type="number" placeholder="Precio" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
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
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
              {Array.from({ length: Math.max(0, 16 - images.length) }).map((_, i) => (
                <label key={`empty-${i}`} className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <ImagePlus className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Foto {images.length + i + 1}</span>
                </label>
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
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Regresar
          </button>
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
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Regresar
            </button>
            {currentStep < 6 ? (
              <button
                onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                Continuar
              </button>
            ) : (
              <button className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                Publicar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}