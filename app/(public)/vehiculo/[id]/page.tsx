"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
  Heart,
  Share2,
  Shield,
  User,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  MessageCircle,
  // CheckBadge,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function VehicleDetailPage() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [saved, setSaved] = useState(false);

  const images = [
    "/placeholder-car.jpg",
    "/placeholder-car.jpg",
    "/placeholder-car.jpg"
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con botón volver */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div className="flex items-center gap-2">
              <Button onClick={() => setSaved(!saved)} variant="ghost" size="icon">
                <Heart className={`h-5 w-5 ${saved ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUMNA IZQUIERDA - Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galería de imágenes */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative aspect-[4/3] bg-gray-100">
                <img
                  src={images[currentImage]}
                  alt="Toyota Corolla"
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <Button onClick={prevImage} variant="ghost" size="icon" className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 shadow-md">
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button onClick={nextImage} variant="ghost" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 shadow-md">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md">Nuevo</span>
                </div>
              </div>
            </div>

            {/* Título y fecha */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900">Toyota Corolla 2020 Full 1.8</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Publicado: 26/02 13:28
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  modificado: 26/02 18:00
                </span>
              </div>
            </div>

            {/* Precio y financiamiento */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl font-bold text-gray-900">$28,900</span>
                <span className="text-gray-400 line-through text-lg">32,000 €</span>
                <span className="text-red-600 text-sm font-semibold">+ Requisito</span>
              </div>
              <p className="text-green-600 font-medium mt-2">
                Financiamiento desde $482/mes - 60 meses
              </p>
              <p className="text-sm text-gray-500 mt-1">IVA incluido</p>
            </div>

            {/* Servicios incluidos */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Servicios incluidos en la cuota</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Seguro A Todo Riesgo Sin Fronteras</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Aventura Y Reparaciones</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Sin Entrada</span>
                </div>
              </div>
              <Button variant="link" className="mt-4">
                Más sobre los servicios →
              </Button>
            </div>

            {/* Contacta con el anunciante */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contacta con el anunciante</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Nombre</p>
                    <p className="font-medium text-gray-900">gabriel@hotmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm text-yellow-700">Correo Electrónico No Se Validó</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Número</p>
                    <p className="font-medium text-gray-900">+52 9878765663</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href="#" className="text-blue-600 text-sm">
                  Acerca de la cuenta / Perfil del vendedor →
                </Link>
              </div>
            </div>

            {/* Guarda tus búsquedas favoritas */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Guarda tus búsquedas favoritas</h2>
              <p className="text-gray-600 text-sm">Recibe alertas de anuncios similares por email</p>
              <Button className="mt-4">
                Crear alerta
              </Button>
            </div>

            {/* Comentarios del anunciante */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Comentarios del anunciante</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Seolco Motor, Concesionario Oficial Volkswagen en Alcorcón y Móstoles, le ofrece este espectacular VOLKSWAGEN Polo Life 1.0 TSI 95-cc completamente nuevo. La calidad y el prestigio de Volkswagen en Alcorcón y Móstoles. Nuestros comerciantes están encantados de ofrecerle y resaltar todos sus datos.
              </p>
              
              <h3 className="font-semibold text-gray-900 mt-4 mb-2">Equipamiento de detección:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
                <li>Fóra Volkswagen Full LED</li>
                <li>Volvómetro Digital Cadpist</li>
                <li>Conectividad App Connect</li>
                <li>Sistema de memoria antigua</li>
                <li>Sistema de almacenamiento de datos</li>
                <li>Control de velocidad de crucero</li>
                <li>Control de velocidad de frenado</li>
              </ul>
              
              <p className="text-gray-600 text-sm italic mt-4">
                Se escribe un mensaje de búsqueda en Volkswagen Polo Life, en Alcorcón y Móstoles, para que viva junto a nosotros la experiencia S-Estéticas!
              </p>
              
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                <p>• El precio publicado corresponde a la versión pública. Unidad de entrega inmediata. Consulte otras opciones.</p>
                <p className="mt-1">• El anuncio puede contener entre 1 y 3 imágenes de los modelos de un futuro contrato.</p>
              </div>
              
              <p className="mt-3 text-gray-400 text-sm">Ref: PoloMotors-Rent-0000</p>
            </div>

            {/* Análisis del precio */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Análisis del precio</h2>
              <p className="text-red-600 font-medium mb-3">El precio es sustancialmente inferior comparado con vehículos similares.</p>
              <span className="inline-block bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">Si es Superprecio</span>
              <p className="text-xs text-gray-400 mt-4">
                La valoración del precio de cada modelo es totalmente neutro y no puede ser inferior.
              </p>
            </div>

            {/* Características generales */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Características generales</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Kilometraje</span>
                  <span className="font-medium">0 Km</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Asientos</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Puertas</span>
                  <span className="font-medium">5</span>
                </div>
              </div>
              <Link href="#" className="mt-4 inline-block text-blue-600 text-sm">
                Ver ficha técnica completa →
              </Link>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Reviews</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">Luis Rodríguez</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">42</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">Luis Rodríguez</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">42</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" />
                Ubicación
              </h3>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-500 mt-1">Mapa</p>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <div className="flex items-center justify-between text-gray-500">
                  <span>MORATALAZ</span>
                  <span>A-3</span>
                </div>
                <p className="text-gray-500 text-xs mt-1">Cerro del Tío Pío • Centro Dep Municipal Margot</p>
                <p className="text-gray-400 text-xs mt-2">Madrid Spain Temple • E-9 VALDEBERNARDO</p>
              </div>
            </div>

         
          </div>

          {/* COLUMNA DERECHA - Vendedor Verificado + Contacta con el anunciante */}
          <div className="space-y-6">
            {/* Vendedor Verificado */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                {/* <CheckBadge className="h-5 w-5 text-blue-600" /> */}
                <h3 className="font-semibold text-gray-900">Vendedor Verificado</h3>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Motores Premium</p>
                  <p className="text-sm text-gray-500">AutoPlaza Lima</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-gray-100">
                <div className="text-center">
                  <p className="font-bold text-gray-900">4.8</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">243</p>
                  <p className="text-xs text-gray-500">Ventas Completadas</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">&gt; 2 Horas</p>
                  <p className="text-xs text-gray-500">Tiempo De Respuesta</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                <MessageCircle className="h-4 w-4" />
                <span>📧 Vendedor Verificado Por WhatsApp</span>
              </div>
            </div>

            {/* Contacta con el anunciante */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contacta con el anunciante</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nombre</p>
                  <p className="font-medium text-gray-900">gabriela@hotmail.com</p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-700">El Correo Electrónico No Es Válido</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="font-medium text-gray-900">📞 +52 9878765663</p>
                </div>

                <textarea 
                  placeholder="Mensaje"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
                ></textarea>

                <div className="flex items-start gap-2">
                  <Checkbox id="accept-terms-detail" />
                  <Label htmlFor="accept-terms-detail" className="text-xs text-gray-500">
                    Acepto las condiciones de uso y la información básica de mi datos
                  </Label>
                </div>

                <Button className="w-full">
                  Contactar
                </Button>

                <Button variant="link" className="w-full">
                  Ir al simulador de financiamiento →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones flotantes móvil */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="flex gap-3">
          <a href="tel:+529878765663" className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-medium">
            <Phone className="h-5 w-5" />
            Llamar
          </a>
          <Button className="flex-1 gap-2">
            <Mail className="h-5 w-5" />
            Contactar
          </Button>
        </div>
      </div>
      <div className="lg:hidden h-20"></div>
    </div>
  );
}