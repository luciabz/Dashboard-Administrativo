/**
 * Dashboard Administrativo - JavaScript
 * Implementación de navegación OOHDM y simulación de tareas concurrentes
 */

// Clase principal del Dashboard (Patrón OOHDM)
class AdminDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.concurrentTasks = new Map();
        this.intervals = new Map();
        this.init();
    }

    // Inicialización del dashboard
    init() {
        this.setupNavigation();
        this.initializeWidgets();
        this.startConcurrentTasks();
        this.setupProgressBars();
        this.startRealTimeUpdates();
        console.log('🚀 Dashboard Administrativo inicializado');
    }

    // Sistema de Navegación OOHDM
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.dataset.section;
                this.navigateToSection(targetSection, link);
            });
        });

        // Navegación por historial del navegador
        window.addEventListener('popstate', (e) => {
            const section = e.state?.section || 'dashboard';
            this.navigateToSection(section);
        });

        // Estado inicial
        const initialSection = window.location.hash.substring(1) || 'dashboard';
        this.navigateToSection(initialSection);
    }

    // Navegación entre secciones (OOHDM Navigation Schema)
    navigateToSection(sectionName, clickedLink = null) {
        // Ocultar sección actual
        const currentSection = document.querySelector('.section.active');
        if (currentSection) {
            currentSection.classList.remove('active');
        }

        // Mostrar nueva sección
        const newSection = document.getElementById(`${sectionName}-section`);
        if (newSection) {
            newSection.classList.add('active');
            this.currentSection = sectionName;

            // Actualizar navegación activa
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            if (clickedLink) {
                clickedLink.classList.add('active');
            } else {
                const targetLink = document.querySelector(`[data-section="${sectionName}"]`);
                if (targetLink) targetLink.classList.add('active');
            }

            // Actualizar URL sin recargar
            history.pushState({ section: sectionName }, '', `#${sectionName}`);
            
            // Animación de entrada
            this.animatePageTransition(newSection);
        }
    }

    // Animación de transición entre páginas
    animatePageTransition(section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            section.style.transition = 'all 0.4s ease-out';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
    }

    // Inicialización de widgets
    initializeWidgets() {
        this.setupCircularProgress();
        this.animateCounters();
        this.setupNotifications();
        this.initializeWorldMap();
        this.setupWeatherWidget();
        this.setupSocialTimeline();
    }

    // Configuración de barras de progreso circulares
    setupCircularProgress() {
        const circularProgresses = document.querySelectorAll('.circular-progress');
        
        circularProgresses.forEach((progress, index) => {
            const percentage = progress.dataset.percentage;
            const circle = progress.querySelector('.progress-circle');
            
            setTimeout(() => {
                const degrees = (percentage / 100) * 360;
                circle.style.background = `conic-gradient(
                    var(--primary-color) ${degrees}deg,
                    #e5e7eb ${degrees}deg
                )`;
                
                // Animación de conteo
                this.animateCounter(progress.querySelector('.percentage'), percentage);
            }, 500 + index * 200);
        });
    }

    // Configuración de barras de progreso lineales
    setupProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach((bar, index) => {
            const progress = bar.dataset.progress;
            
            setTimeout(() => {
                bar.style.width = `${progress}%`;
            }, 1000 + index * 300);
        });
    }

    // Animación de contadores
    animateCounters() {
        const counters = [
            { id: 'users-count', target: 1247, suffix: '' },
            { id: 'sales-count', target: 42389, prefix: '$', suffix: '' },
            { id: 'orders-count', target: 156, suffix: '' }
        ];

        counters.forEach((counter, index) => {
            setTimeout(() => {
                this.animateCounter(
                    document.getElementById(counter.id), 
                    counter.target, 
                    counter.prefix, 
                    counter.suffix
                );
            }, 2000 + index * 500);
        });
    }

    // Función de animación de contadores
    animateCounter(element, target, prefix = '', suffix = '') {
        if (!element) return;
        
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Función de easing
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutExpo);
            element.textContent = `${prefix}${currentValue.toLocaleString()}${suffix}`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Sistema de tareas concurrentes (Simulación)
    startConcurrentTasks() {
        // Tarea 1: Backup de base de datos
        this.createConcurrentTask('backup', {
            name: 'Backup Base de Datos',
            initialProgress: 67,
            speed: 0.5,
            maxProgress: 100,
            element: document.querySelector('.task-item:nth-child(1) .progress-fill')
        });

        // Tarea 2: Sincronización de archivos
        this.createConcurrentTask('sync', {
            name: 'Sincronización de Archivos',
            initialProgress: 43,
            speed: 0.3,
            maxProgress: 100,
            element: document.querySelector('.task-item:nth-child(2) .progress-fill')
        });

        // Tarea 3: Ya completada
        const completedTask = document.querySelector('.task-item:nth-child(3) .progress-fill');
        if (completedTask) {
            completedTask.style.width = '100%';
        }

        console.log('📋 Tareas concurrentes iniciadas');
    }

    // Crear tarea concurrente
    createConcurrentTask(taskId, config) {
        this.concurrentTasks.set(taskId, config);
        
        const interval = setInterval(() => {
            const task = this.concurrentTasks.get(taskId);
            if (!task || !task.element) return;

            if (task.initialProgress < task.maxProgress) {
                task.initialProgress += task.speed;
                task.element.style.width = `${Math.min(task.initialProgress, task.maxProgress)}%`;
                
                // Actualizar estado visual
                if (task.initialProgress >= task.maxProgress) {
                    task.element.classList.add('completed');
                    const statusElement = task.element.parentElement.parentElement.querySelector('.task-status');
                    if (statusElement) {
                        statusElement.textContent = 'Completado';
                        statusElement.classList.remove('processing');
                        statusElement.classList.add('completed');
                    }
                    clearInterval(interval);
                    this.intervals.delete(taskId);
                    
                    // Mostrar notificación de completado
                    this.showTaskNotification(task.name);
                }
            }
        }, 100);

        this.intervals.set(taskId, interval);
    }

    // Mostrar notificación de tarea completada
    showTaskNotification(taskName) {
        const notification = document.createElement('div');
        notification.className = 'task-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${taskName} completado exitosamente</span>
        `;
        
        // Estilos inline para la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: 'var(--success-color)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease-out'
        });

        document.body.appendChild(notification);

        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Sistema de notificaciones interactivas
    setupNotifications() {
        const notificationItems = document.querySelectorAll('.notification-item');
        
        notificationItems.forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('unread')) {
                    item.classList.remove('unread');
                    this.updateNotificationBadge();
                    this.showToast('Notificación marcada como leída');
                }
            });
        });
    }

    // Actualizar badge de notificaciones
    updateNotificationBadge() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notification-badge');
        
        if (badge) {
            badge.textContent = unreadCount;
            if (unreadCount === 0) {
                badge.style.display = 'none';
            }
        }
    }

    // Mostrar toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        const colors = {
            success: 'var(--success-color)',
            warning: 'var(--warning-color)',
            error: 'var(--error-color)',
            info: 'var(--primary-color)'
        };

        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            background: colors[type],
            color: 'white',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: '9999',
            transform: 'translateY(100px)',
            transition: 'transform 0.3s ease-out',
            fontSize: '0.875rem'
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
        }, 100);

        setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 2500);
    }

    // Actualizaciones en tiempo real
    startRealTimeUpdates() {
        // Simular actualizaciones de estadísticas cada 10 segundos
        setInterval(() => {
            this.updateLiveStats();
        }, 10000);

        // Actualizar hora cada segundo en el dashboard
        setInterval(() => {
            this.updateSystemTime();
        }, 1000);

        // Simular nuevas notificaciones aleatorias
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.addRandomNotification();
            }
        }, 30000);
    }

    // Actualizar estadísticas en tiempo real
    updateLiveStats() {
        const stats = [
            { id: 'users-count', variance: 10 },
            { id: 'orders-count', variance: 5 }
        ];

        stats.forEach(stat => {
            const element = document.getElementById(stat.id);
            if (element) {
                const currentValue = parseInt(element.textContent.replace(/[^\d]/g, ''));
                const change = Math.floor(Math.random() * stat.variance * 2) - stat.variance;
                const newValue = Math.max(0, currentValue + change);
                
                element.style.transition = 'all 0.3s ease';
                element.style.transform = 'scale(1.1)';
                element.textContent = newValue.toLocaleString();
                
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 300);
            }
        });
    }

    // Actualizar hora del sistema (para demostración)
    updateSystemTime() {
        this.currentTime = new Date();
        
        // Actualizar la hora en el footer
        const lastUpdateElement = document.getElementById('last-update');
        if (lastUpdateElement) {
            const timeString = this.currentTime.toLocaleTimeString('es-ES');
            lastUpdateElement.textContent = timeString;
        }
    }

    // Agregar notificación aleatoria
    addRandomNotification() {
        const messages = [
            'Nuevo usuario registrado',
            'Actualización de seguridad disponible',
            'Backup programado completado',
            'Maintenance window próximo',
            'Nuevo mensaje del equipo de soporte'
        ];

        const message = messages[Math.floor(Math.random() * messages.length)];
        
        // Crear elemento de notificación
        const notificationsList = document.querySelector('.notifications-list');
        if (notificationsList) {
            const notification = document.createElement('div');
            notification.className = 'notification-item unread';
            notification.innerHTML = `
                <i class="fas fa-bell"></i>
                <span>${message}</span>
            `;

            // Agregar al principio de la lista
            notificationsList.insertBefore(notification, notificationsList.firstChild);

            // Configurar evento click
            notification.addEventListener('click', () => {
                notification.classList.remove('unread');
                this.updateNotificationBadge();
                this.showToast('Notificación marcada como leída');
            });

            // Actualizar badge
            this.updateNotificationBadge();

            // Animación de entrada
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-20px)';
            
            requestAnimationFrame(() => {
                notification.style.transition = 'all 0.3s ease';
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            });
        }
    }

    // Inicializar mapa mundial interactivo
    initializeWorldMap() {
        const userDots = document.querySelectorAll('.user-dot');
        
        userDots.forEach(dot => {
            const users = parseInt(dot.dataset.users.replace(/,/g, ''));
            
            // Colorear según la cantidad de usuarios
            if (users > 1000) {
                dot.style.background = '#ef4444';
                dot.classList.add('high-activity');
            } else if (users > 500) {
                dot.style.background = '#f59e0b';
                dot.classList.add('medium-activity');
            } else {
                dot.style.background = '#10b981';
                dot.classList.add('low-activity');
            }
            
            // Agregar interactividad
            dot.addEventListener('click', () => {
                this.showCountryDetails(dot.dataset.country, dot.dataset.users);
            });
            
            // Animación aleatoria de pulsos
            setTimeout(() => {
                dot.style.animationDelay = Math.random() * 2 + 's';
            }, Math.random() * 1000);
        });
        
        // Simular nuevas conexiones
        setInterval(() => {
            this.simulateNewConnection();
        }, 8000);
    }

    // Mostrar detalles del país
    showCountryDetails(country, users) {
        this.showToast(`${country}: ${users} usuarios activos`, 'info');
        
        // Crear mini popup con más detalles
        const popup = document.createElement('div');
        popup.className = 'country-popup';
        popup.innerHTML = `
            <h4>${country}</h4>
            <p><strong>${users}</strong> usuarios activos</p>
            <p>Última conexión: hace ${Math.floor(Math.random() * 5) + 1} min</p>
            <p>Tráfico: ${(Math.random() * 100).toFixed(1)} MB/s</p>
        `;
        
        Object.assign(popup.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            zIndex: '10000',
            minWidth: '200px',
            textAlign: 'center'
        });
        
        document.body.appendChild(popup);
        
        // Cerrar después de 3 segundos
        setTimeout(() => {
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => {
                if (popup.parentNode) popup.parentNode.removeChild(popup);
            }, 300);
        }, 3000);
    }

    // Simular nueva conexión
    simulateNewConnection() {
        const countries = ['Alemania', 'México', 'Japón', 'Canadá', 'Italia'];
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        const users = Math.floor(Math.random() * 500) + 100;
        
        this.showToast(`Nueva conexión desde ${randomCountry}`, 'success');
    }

    // Configurar widget de clima
    setupWeatherWidget() {
        const weatherIcon = document.querySelector('.weather-icon i');
        const weatherTemp = document.querySelector('.weather-temp');
        
        // Simular cambios de temperatura cada 30 segundos
        setInterval(() => {
            const temps = ['16°C', '17°C', '18°C', '19°C', '20°C'];
            const newTemp = temps[Math.floor(Math.random() * temps.length)];
            weatherTemp.textContent = newTemp;
            
            // Efecto de actualización
            weatherTemp.style.transform = 'scale(1.1)';
            setTimeout(() => {
                weatherTemp.style.transform = 'scale(1)';
            }, 200);
        }, 30000);
        
        // Animación del icono al hacer hover
        weatherIcon.addEventListener('mouseenter', () => {
            weatherIcon.style.animation = 'spin 0.5s ease-in-out';
        });
        
        weatherIcon.addEventListener('mouseleave', () => {
            setTimeout(() => {
                weatherIcon.style.animation = 'weatherFloat 3s ease-in-out infinite';
            }, 500);
        });
    }

    // Configurar timeline social
    setupSocialTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        // Animar entrada de items
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.4s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100 + index * 150);
        });
        
        // Agregar nuevos eventos cada 45 segundos
        setInterval(() => {
            this.addTimelineEvent();
        }, 45000);
    }

    // Agregar nuevo evento al timeline
    addTimelineEvent() {
        const events = [
            { user: 'Sistema', action: 'realizó mantenimiento programado', avatar: 'S', color: '#10b981' },
            { user: 'Usuario Carlos', action: 'completó un pedido importante', avatar: 'C', color: '#4f46e5' },
            { user: 'Admin', action: 'configuró nuevas reglas de seguridad', avatar: 'A', color: '#f59e0b' },
            { user: 'Bot de Monitoreo', action: 'detectó mejora en rendimiento', avatar: 'B', color: '#06b6d4' }
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const timeline = document.querySelector('.social-timeline');
        
        if (timeline) {
            const newItem = document.createElement('div');
            newItem.className = 'timeline-item';
            newItem.innerHTML = `
                <div class="timeline-avatar">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='${randomEvent.color}'/%3E%3Ctext x='16' y='20' text-anchor='middle' fill='white' font-size='12' font-weight='bold'%3E${randomEvent.avatar}%3C/text%3E%3C/svg%3E" alt="${randomEvent.user}">
                </div>
                <div class="timeline-content">
                    <strong>${randomEvent.user}</strong> ${randomEvent.action}
                    <span class="timeline-time">Hace 1 min</span>
                </div>
            `;
            
            // Insertar al principio
            timeline.insertBefore(newItem, timeline.firstChild);
            
            // Animación de entrada
            newItem.style.opacity = '0';
            newItem.style.transform = 'translateX(-20px)';
            
            requestAnimationFrame(() => {
                newItem.style.transition = 'all 0.4s ease-out';
                newItem.style.opacity = '1';
                newItem.style.transform = 'translateX(0)';
            });
            
            // Remover elementos antiguos si hay más de 4
            const items = timeline.querySelectorAll('.timeline-item');
            if (items.length > 4) {
                const oldItem = items[items.length - 1];
                oldItem.style.opacity = '0';
                oldItem.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    if (oldItem.parentNode) {
                        oldItem.parentNode.removeChild(oldItem);
                    }
                }, 400);
            }
        }
    }

    // Método para limpiar recursos al salir
    destroy() {
        // Limpiar todos los intervalos
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals.clear();
        this.concurrentTasks.clear();
        console.log('🧹 Dashboard limpiado');
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia del dashboard
    window.adminDashboard = new AdminDashboard();

    // Agregar estilos adicionales para animaciones
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        .task-notification {
            font-weight: 500;
        }
        
        .toast {
            font-weight: 500;
        }
        
        .notification-item {
            animation: slideInFromLeft 0.3s ease-out;
        }
        
        @keyframes slideInFromLeft {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(additionalStyles);

    console.log('🎯 Sistema completamente inicializado');
});

// Limpiar recursos al salir de la página
window.addEventListener('beforeunload', () => {
    if (window.adminDashboard) {
        window.adminDashboard.destroy();
    }
});

// Manejo de errores globales
window.addEventListener('error', (event) => {
    console.error('❌ Error en el dashboard:', event.error);
});

// Exportar clases para uso externo si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdminDashboard };
}
