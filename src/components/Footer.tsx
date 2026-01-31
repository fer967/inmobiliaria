import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-6">
                        <div className="flex items-center text-white">
                            <span className="text-2xl font-bold tracking-tight">Connect<span className="text-indigo-400 italic">Prop</span></span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Líderes en el mercado inmobiliario de Córdoba, combinando tecnología de vanguardia y datos precisos de IDECOR para ofrecer la mejor experiencia.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-indigo-400 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-indigo-400 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-indigo-400 transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Navegación</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Propiedades</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Vender</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Alquilar</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Inversores</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Servicios</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Consultoría Catastral</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Tasaciones Online</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Administración</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Soporte CRM</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Contacto</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-center">
                                <Phone size={16} className="mr-3 text-indigo-400" />
                                +54 351 444 5555
                            </li>
                            <li className="flex items-center">
                                <Mail size={16} className="mr-3 text-indigo-400" />
                                info@connectprop.com
                            </li>
                            <li className="flex items-center">
                                <MapPin size={16} className="mr-3 text-indigo-400" />
                                Av. Rafael Nuñez 4000, Córdoba
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
                    <p>&copy; 2024 ConnectProp Córdoba. Todos los derechos reservados.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Términos y Condiciones</a>
                        <a href="#" className="hover:text-white">Política de Privacidad</a>
                        <a href="#" className="hover:text-white">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;