import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Welcome': 'Welcome',
      'Change Password': 'Change Password',
      'Manage Plan': 'Manage Plan',
      'Edit': 'Edit',
      'View': 'View',
      'Premium (Mock)': 'Premium (Mock)',
      'English (Mock)': 'English (Mock)',
      'Maturity Settings': 'Maturity Settings',
      'All Maturity Ratings (Mock)': 'All Maturity Ratings (Mock)',
      'Viewing Activity': 'Viewing Activity',
      'See what you\'ve watched': 'See what you\'ve watched',
      'Playback Settings': 'Playback Settings',
      'Autoplay Next Episode': 'Autoplay Next Episode',
      'Automatically play the next episode': 'Automatically play the next episode',
      'Data Usage per Screen': 'Data Usage per Screen',
      'Control playback quality': 'Control playback quality',
      'Auto': 'Auto',
      'Personalization': 'Personalization',
      'Subtitle Appearance': 'Subtitle Appearance',
      'Customize subtitles': 'Customize subtitles',
      'App Language': 'App Language',
      'Notifications': 'Notifications',
      'Get updates about new content': 'Get updates about new content',
      'Dark Mode': 'Dark Mode',
      'Switch theme appearance': 'Switch theme appearance',
      'Security': 'Security',
      'Sign out of all devices': 'Sign out of all devices',
      'Force sign out everywhere': 'Force sign out everywhere',
      'Sign Out': 'Sign Out',
      'Help & Support': 'Help & Support',
      'Need help?': 'Need help?',
      'Visit our FAQ or Contact Support': 'Visit our FAQ or Contact Support',
    }
  },
  es: {
    translation: {
      'Welcome': 'Bienvenido',
      'Change Password': 'Cambiar contraseña',
      'Manage Plan': 'Gestionar plan',
      'Edit': 'Editar',
      'View': 'Ver',
      'Premium (Mock)': 'Premium (Simulado)',
      'English (Mock)': 'Inglés (Simulado)',
      'Maturity Settings': 'Configuración de madurez',
      'All Maturity Ratings (Mock)': 'Todas las clasificaciones de madurez (Simulado)',
      'Viewing Activity': 'Actividad de visualización',
      'See what you\'ve watched': 'Ver lo que has visto',
      'Playback Settings': 'Configuración de reproducción',
      'Autoplay Next Episode': 'Reproducir automáticamente el siguiente episodio',
      'Automatically play the next episode': 'Reproducir automáticamente el siguiente episodio',
      'Data Usage per Screen': 'Uso de datos por pantalla',
      'Control playback quality': 'Controlar la calidad de reproducción',
      'Auto': 'Auto',
      'Personalization': 'Personalización',
      'Subtitle Appearance': 'Apariencia de subtítulos',
      'Customize subtitles': 'Personalizar subtítulos',
      'App Language': 'Idioma de la aplicación',
      'Notifications': 'Notificaciones',
      'Get updates about new content': 'Recibe actualizaciones sobre nuevo contenido',
      'Dark Mode': 'Modo oscuro',
      'Switch theme appearance': 'Cambiar apariencia del tema',
      'Security': 'Seguridad',
      'Sign out of all devices': 'Cerrar sesión en todos los dispositivos',
      'Force sign out everywhere': 'Forzar cierre de sesión en todas partes',
      'Sign Out': 'Cerrar sesión',
      'Help & Support': 'Ayuda y soporte',
      'Need help?': '¿Necesitas ayuda?',
      'Visit our FAQ or Contact Support': 'Visita nuestro FAQ o Contacta Soporte',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 