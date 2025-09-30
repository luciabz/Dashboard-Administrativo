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
        this.animateSentimentWidget();
        this.initializeQRCode();
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

    // Animar widget de sentimientos
    animateSentimentWidget() {
        const scoreNumber = document.querySelector('.score-number');
        const scoreCircle = document.querySelector('.score-circle');
        
        if (scoreNumber && scoreCircle) {
            // Animar contador de puntuación
            this.animateCounter(scoreNumber, 8.7, '', '', 1);
            
            // Actualizar score periódicamente
            setInterval(() => {
                const newScore = (Math.random() * 2 + 7.5).toFixed(1);
                const degrees = (newScore / 10) * 360;
                
                scoreCircle.style.background = `conic-gradient(from 0deg, var(--success-color) 0deg, var(--success-color) ${degrees}deg, #e5e7eb ${degrees}deg)`;
                
                this.animateCounter(scoreNumber, parseFloat(newScore), '', '', 1);
            }, 15000);
        }
    }

    // Inicializar código QR
    initializeQRCode() {
        const qrSquares = document.querySelectorAll('.qr-square');
        
        // Animar cuadrados del QR de forma aleatoria
        qrSquares.forEach((square, index) => {
            square.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Función global para refrescar QR
        window.refreshQR = () => {
            qrSquares.forEach(square => {
                square.style.animation = 'none';
                setTimeout(() => {
                    square.style.animation = 'qrFlicker 2s infinite';
                    square.style.animationDelay = `${Math.random() * 0.5}s`;
                }, 10);
            });
            
            this.showToast('Código QR renovado', 'success');
        };
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

// Clase para manejo de gráficos (simulación)
class ChartManager {
    constructor() {
        this.charts = new Map();
        this.init();
    }

    init() {
        this.createSalesChart();
    }

    createSalesChart() {
        const chartContainer = document.querySelector('.chart-container');
        if (!chartContainer) return;

        // Simular datos de gráfico más complejos
        const salesData = this.generateSalesData();
        this.renderAdvancedChart(chartContainer, salesData);
        
        // Crear gráfico de líneas adicional
        setTimeout(() => {
            this.createLineChart();
        }, 1500);
    }

    generateSalesData() {
        const data = [];
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'];
        const baseValue = 25000;
        
        for (let i = 0; i < months.length; i++) {
            // Crear tendencia realista con crecimiento
            const trend = baseValue + (i * 3000);
            const variance = Math.floor(Math.random() * 10000) - 5000;
            data.push({
                month: months[i],
                sales: Math.max(10000, trend + variance),
                target: trend + 5000,
                growth: i > 0 ? ((trend + variance) - data[i-1].sales) / data[i-1].sales * 100 : 0
            });
        }
        
        return data;
    }

    renderAdvancedChart(container, data) {
        const containerRect = container.getBoundingClientRect();
        const chartWidth = containerRect.width || 400;
        const chartHeight = 250;
        const padding = { top: 20, right: 40, bottom: 40, left: 60 };
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', chartWidth);
        svg.setAttribute('height', chartHeight);
        svg.setAttribute('viewBox', `0 0 ${chartWidth} ${chartHeight}`);
        svg.style.background = 'transparent';

        // Crear definiciones para gradientes y efectos
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        
        // Gradiente principal
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'barGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '0%');
        gradient.setAttribute('y2', '100%');
        
        const stops = [
            { offset: '0%', color: '#4f46e5', opacity: '1' },
            { offset: '50%', color: '#7c3aed', opacity: '0.8' },
            { offset: '100%', color: '#06b6d4', opacity: '0.6' }
        ];
        
        stops.forEach(stop => {
            const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stopElement.setAttribute('offset', stop.offset);
            stopElement.setAttribute('stop-color', stop.color);
            stopElement.setAttribute('stop-opacity', stop.opacity);
            gradient.appendChild(stopElement);
        });
        
        // Gradiente para área de fondo
        const areaGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        areaGradient.setAttribute('id', 'areaGradient');
        areaGradient.setAttribute('x1', '0%');
        areaGradient.setAttribute('y1', '0%');
        areaGradient.setAttribute('x2', '0%');
        areaGradient.setAttribute('y2', '100%');
        
        const areaStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        areaStop1.setAttribute('offset', '0%');
        areaStop1.setAttribute('stop-color', '#4f46e5');
        areaStop1.setAttribute('stop-opacity', '0.1');
        
        const areaStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        areaStop2.setAttribute('offset', '100%');
        areaStop2.setAttribute('stop-color', '#4f46e5');
        areaStop2.setAttribute('stop-opacity', '0');
        
        areaGradient.appendChild(areaStop1);
        areaGradient.appendChild(areaStop2);
        
        // Filtro de sombra
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'shadow');
        
        const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
        feDropShadow.setAttribute('dx', '0');
        feDropShadow.setAttribute('dy', '4');
        feDropShadow.setAttribute('stdDeviation', '3');
        feDropShadow.setAttribute('flood-opacity', '0.1');
        
        filter.appendChild(feDropShadow);
        
        defs.appendChild(gradient);
        defs.appendChild(areaGradient);
        defs.appendChild(filter);
        svg.appendChild(defs);

        // Calcular dimensiones del gráfico
        const graphWidth = chartWidth - padding.left - padding.right;
        const graphHeight = chartHeight - padding.top - padding.bottom;
        const maxValue = Math.max(...data.map(d => Math.max(d.sales, d.target)));
        const barWidth = graphWidth / data.length * 0.6;
        const barSpacing = graphWidth / data.length * 0.4;

        // Crear grid de fondo
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            const y = padding.top + (graphHeight / gridLines) * i;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', padding.left);
            line.setAttribute('y1', y);
            line.setAttribute('x2', chartWidth - padding.right);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', '#e5e7eb');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('opacity', '0.5');
            svg.appendChild(line);
            
            // Etiquetas del eje Y
            const value = Math.round(maxValue - (maxValue / gridLines) * i);
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', padding.left - 10);
            text.setAttribute('y', y + 4);
            text.setAttribute('text-anchor', 'end');
            text.setAttribute('fill', '#6b7280');
            text.setAttribute('font-size', '11');
            text.textContent = `$${(value / 1000).toFixed(0)}K`;
            svg.appendChild(text);
        }

        // Crear línea de tendencia de fondo
        let pathData = '';
        data.forEach((item, index) => {
            const x = padding.left + (index * (graphWidth / data.length)) + (graphWidth / data.length / 2);
            const y = padding.top + graphHeight - ((item.sales / maxValue) * graphHeight);
            
            if (index === 0) {
                pathData += `M ${x} ${y}`;
            } else {
                pathData += ` L ${x} ${y}`;
            }
        });
        
        // Área bajo la curva
        const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        area.setAttribute('d', pathData + ` L ${chartWidth - padding.right} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`);
        area.setAttribute('fill', 'url(#areaGradient)');
        area.setAttribute('opacity', '0');
        svg.appendChild(area);
        
        // Animación del área
        setTimeout(() => {
            area.style.transition = 'opacity 1s ease-in-out';
            area.setAttribute('opacity', '1');
        }, 500);

        // Crear barras con animación
        data.forEach((item, index) => {
            const x = padding.left + (index * (graphWidth / data.length)) + (barSpacing / 2);
            const barHeight = (item.sales / maxValue) * graphHeight;
            const targetHeight = (item.target / maxValue) * graphHeight;
            const y = padding.top + graphHeight - barHeight;
            const targetY = padding.top + graphHeight - targetHeight;

            // Barra objetivo (gris claro)
            const targetBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            targetBar.setAttribute('x', x);
            targetBar.setAttribute('y', targetY);
            targetBar.setAttribute('width', barWidth);
            targetBar.setAttribute('height', targetHeight);
            targetBar.setAttribute('fill', '#e5e7eb');
            targetBar.setAttribute('rx', '4');
            targetBar.setAttribute('opacity', '0.5');
            svg.appendChild(targetBar);

            // Barra principal animada
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', x);
            rect.setAttribute('y', chartHeight - padding.bottom);
            rect.setAttribute('width', barWidth);
            rect.setAttribute('height', '0');
            rect.setAttribute('fill', 'url(#barGradient)');
            rect.setAttribute('rx', '4');
            rect.setAttribute('filter', 'url(#shadow)');
            
            // Efecto hover
            rect.style.cursor = 'pointer';
            rect.addEventListener('mouseenter', () => {
                rect.style.transition = 'all 0.2s ease';
                rect.setAttribute('filter', 'url(#shadow) brightness(1.1)');
                this.showTooltip(item, rect);
            });
            
            rect.addEventListener('mouseleave', () => {
                rect.setAttribute('filter', 'url(#shadow)');
                this.hideTooltip();
            });

            svg.appendChild(rect);

            // Animación de crecimiento
            setTimeout(() => {
                rect.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                rect.setAttribute('y', y);
                rect.setAttribute('height', barHeight);
            }, 200 + index * 150);

            // Etiqueta del mes
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x + barWidth / 2);
            text.setAttribute('y', chartHeight - padding.bottom + 15);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#6b7280');
            text.setAttribute('font-size', '11');
            text.setAttribute('font-weight', '500');
            text.textContent = item.month;
            svg.appendChild(text);

            // Indicador de crecimiento
            if (item.growth > 0) {
                const growthIcon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                growthIcon.setAttribute('x', x + barWidth / 2);
                growthIcon.setAttribute('y', y - 8);
                growthIcon.setAttribute('text-anchor', 'middle');
                growthIcon.setAttribute('fill', '#10b981');
                growthIcon.setAttribute('font-size', '12');
                growthIcon.textContent = '↗';
                svg.appendChild(growthIcon);
            }
        });

        // Limpiar contenedor y agregar gráfico
        container.innerHTML = '';
        container.appendChild(svg);
    }

    createLineChart() {
        // Crear un segundo gráfico de líneas en miniatura
        const miniChartContainer = document.createElement('div');
        miniChartContainer.className = 'mini-chart';
        miniChartContainer.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            width: 120px;
            height: 60px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 6px;
            padding: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        const miniSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        miniSvg.setAttribute('width', '100%');
        miniSvg.setAttribute('height', '100%');

        // Datos para mini gráfico
        const miniData = [20, 35, 25, 40, 35, 50, 45, 60];
        const maxMini = Math.max(...miniData);
        const miniWidth = 104;
        const miniHeight = 44;

        let miniPath = '';
        miniData.forEach((value, index) => {
            const x = (index / (miniData.length - 1)) * miniWidth;
            const y = miniHeight - ((value / maxMini) * miniHeight);
            
            if (index === 0) {
                miniPath += `M ${x} ${y}`;
            } else {
                miniPath += ` L ${x} ${y}`;
            }
        });

        const miniLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        miniLine.setAttribute('d', miniPath);
        miniLine.setAttribute('stroke', '#4f46e5');
        miniLine.setAttribute('stroke-width', '2');
        miniLine.setAttribute('fill', 'none');
        miniLine.style.strokeDasharray = '200';
        miniLine.style.strokeDashoffset = '200';
        
        miniSvg.appendChild(miniLine);
        miniChartContainer.appendChild(miniSvg);
        
        // Agregar al contenedor del gráfico
        document.querySelector('.chart-container').style.position = 'relative';
        document.querySelector('.chart-container').appendChild(miniChartContainer);

        // Animar línea
        setTimeout(() => {
            miniLine.style.transition = 'stroke-dashoffset 1s ease-in-out';
            miniLine.style.strokeDashoffset = '0';
        }, 100);
    }

    showTooltip(data, element) {
        // Crear tooltip dinámico
        const tooltip = document.createElement('div');
        tooltip.id = 'chart-tooltip';
        tooltip.innerHTML = `
            <strong>${data.month}</strong><br>
            Ventas: $${data.sales.toLocaleString()}<br>
            Objetivo: $${data.target.toLocaleString()}<br>
            <span style="color: ${data.growth > 0 ? '#10b981' : '#ef4444'}">
                ${data.growth > 0 ? '↗' : '↘'} ${Math.abs(data.growth).toFixed(1)}%
            </span>
        `;
        
        Object.assign(tooltip.style, {
            position: 'absolute',
            background: '#1f2937',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: '1000',
            pointerEvents: 'none',
            opacity: '0',
            transform: 'translateY(10px)',
            transition: 'all 0.2s ease'
        });

        document.body.appendChild(tooltip);

        // Posicionar tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

        // Mostrar con animación
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        });
    }

    hideTooltip() {
        const tooltip = document.getElementById('chart-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 200);
        }
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia del dashboard
    window.adminDashboard = new AdminDashboard();
    window.chartManager = new ChartManager();

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
    module.exports = { AdminDashboard, ChartManager };
}
