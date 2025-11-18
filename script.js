// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 性能优化：使用requestAnimationFrame
    const requestAnimationFrame = window.requestAnimationFrame || 
                                 window.webkitRequestAnimationFrame || 
                                 window.mozRequestAnimationFrame || 
                                 window.msRequestAnimationFrame || 
                                 function(callback) { setTimeout(callback, 16); };
    
    // 初始化背景音乐
    initAudio();
    
    // 初始化祝福语轮询显示
    initWishes();
    
    // 初始化音频播放功能
    function initAudio() {
        const audio = document.getElementById('backgroundMusic');
        if (!audio) return;
        
        // 尝试自动播放（可能会被浏览器限制阻止）
        audio.play().catch(error => {
            console.log('自动播放被浏览器阻止，等待用户交互...');
        });
    }
    
    // 用户交互触发的庆祝效果和背景音乐
    function setupCelebrationEffects() {
        // 增强庆祝效果的函数
        const enhanceCelebration = () => {
            // 尝试播放背景音乐
            const audio = document.getElementById('backgroundMusic');
            if (audio) {
                audio.volume = 0.3; // 设置音量为30%
                audio.play().catch(error => {
                    console.log('播放背景音乐失败:', error);
                });
            }
            // 创建额外的彩带爆发
            createConfettiBurst();
            
            // 添加闪烁效果到蛋糕
            const cake = document.querySelector('.cake');
            cake.classList.add('celebration-flash');
            setTimeout(() => {
                cake.classList.remove('celebration-flash');
            }, 1000);
            
            // 增强蜡烛火焰
            const flames = document.querySelectorAll('.flame');
            flames.forEach(flame => {
                flame.style.animationDuration = '0.3s';
                flame.style.transform = 'translateX(-50%) scale(1.2)';
                setTimeout(() => {
                    flame.style.animationDuration = '';
                    flame.style.transform = '';
                }, 2000);
            });
            
            // 移除所有事件监听器
            document.removeEventListener('click', enhanceCelebration);
            document.removeEventListener('touchstart', enhanceCelebration);
            document.removeEventListener('keydown', enhanceCelebration);
        };
        
        // 添加事件监听器
        document.addEventListener('click', enhanceCelebration);
        document.addEventListener('touchstart', enhanceCelebration);
        document.addEventListener('keydown', enhanceCelebration);
    }
    
    // 创建彩带爆发效果
    function createConfettiBurst() {
        const decorations = document.querySelector('.decorations');
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fdcb6e'];
        
        // 创建大量彩带
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // 从中心向四周扩散
            const angle = (i / 30) * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            confetti.style.position = 'fixed';
            confetti.style.left = centerX + 'px';
            confetti.style.top = centerY + 'px';
            confetti.style.transform = 'translate(-50%, -50%)';
            
            const size = Math.random() * 10 + 5;
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            
            // 随机动画持续时间
            const duration = Math.random() * 3 + 2;
            confetti.style.animationDuration = duration + 's';
            
            // 使用CSS变量存储额外属性
            confetti.style.setProperty('--horizontal-movement', Math.cos(angle) * distance + 'px');
            confetti.style.setProperty('--vertical-movement', Math.sin(angle) * distance + 'px');
            
            decorations.appendChild(confetti);
            
            // 应用爆发动画
            setTimeout(() => {
                confetti.style.transition = `transform ${duration}s ease-out`;
                confetti.style.transform = `translate(calc(-50% + var(--horizontal-movement, 0px)), calc(-50% + var(--vertical-movement, 0px) + 100vh)) rotate(360deg)`;
                confetti.style.opacity = '0';
            }, 10);
            
            // 动画结束后移除元素
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, duration * 1000);
        }
    }
    
    // 添加庆祝闪光样式
    const style = document.createElement('style');
    style.textContent = `
        .celebration-flash {
            animation: celebration-flash 1s ease-in-out;
        }
        
        @keyframes celebration-flash {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.5); transform: translateX(-50%) scale(1.1); }
        }
    `;
    document.head.appendChild(style);
    
    // 启动庆祝效果设置
    setupCelebrationEffects();
    
    // 使用requestAnimationFrame初始化动画以提高性能
    requestAnimationFrame(() => {
        // 初始化彩带飘落效果
        initConfetti();
        
        // 初始化祝福语动画
        initWishes();
        
        // 增强蜡烛火焰效果
        enhanceFlames();
        
        // 添加蛋糕弹跳动画
        addCakeAnimation();
        
        // 处理触摸设备
        handleTouchDevices();
        
        // 尝试在动画初始化后播放音乐（作为最后手段）
        setTimeout(() => {
            const audio = document.getElementById('backgroundMusic');
            if (audio && audio.paused) {
                // 创建一个用户界面提示
                const musicHint = document.createElement('div');
                musicHint.textContent = '点击页面播放背景音乐';
                musicHint.style.position = 'fixed';
                musicHint.style.bottom = '20px';
                musicHint.style.left = '50%';
                musicHint.style.transform = 'translateX(-50%)';
                musicHint.style.padding = '10px 20px';
                musicHint.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                musicHint.style.borderRadius = '20px';
                musicHint.style.fontSize = '14px';
                musicHint.style.cursor = 'pointer';
                musicHint.style.zIndex = '1000';
                
                musicHint.addEventListener('click', function() {
                    audio.volume = 0.3;
                    audio.play();
                });
                
                // 添加音频播放事件监听器，确保音乐播放后提示自动消失
                audio.addEventListener('play', function() {
                    if (musicHint && musicHint.parentNode) {
                        musicHint.remove();
                    }
                });
                
                document.body.appendChild(musicHint);
            }
        }, 1000);
    });
});

// 初始化彩带飘落效果 - 性能优化版
function initConfetti() {
    const decorations = document.querySelector('.decorations');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fdcb6e'];
    
    // 检测设备性能，调整彩带数量
    let confettiCount = 30; // 默认数量
    
    // 根据设备性能调整效果
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        // 低端设备减少彩带数量
        confettiCount = 15;
    }
    
    // 清除现有的彩带
    decorations.innerHTML = '';
    
    // 创建彩带的函数
    function createConfetti(delay = 0) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // 随机颜色
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // 随机位置
            confetti.style.left = Math.random() * 100 + '%';
            
            // 随机大小
            const size = Math.random() * 10 + 5;
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            
            // 随机动画持续时间和延迟
            const duration = Math.random() * 5 + 3;
            confetti.style.animationDuration = duration + 's';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            
            // 随机动画方向和角度
            const rotation = Math.random() * 360;
            const horizontalMovement = (Math.random() - 0.5) * 100;
            confetti.style.transform = `rotate(${rotation}deg)`;
            
            // 使用CSS变量存储额外属性，避免频繁重绘
            confetti.style.setProperty('--horizontal-movement', horizontalMovement + 'px');
            
            decorations.appendChild(confetti);
            
            // 动画结束后移除元素
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, (duration + 2) * 1000);
        }, delay);
    }
    
    // 分批创建初始彩带，避免一次性创建太多DOM元素
    let batchSize = 5;
    let batches = Math.ceil(confettiCount / batchSize);
    
    for (let batch = 0; batch < batches; batch++) {
        for (let i = 0; i < batchSize && (batch * batchSize + i) < confettiCount; i++) {
            createConfetti(batch * 300);
        }
    }
    
    // 循环生成彩带 - 使用更智能的频率控制
    const confettiInterval = setInterval(() => {
        // 限制页面上彩带的最大数量
        const currentConfetti = document.querySelectorAll('.confetti').length;
        if (currentConfetti < confettiCount) {
            // 根据当前彩带数量动态调整新创建的数量
            const newCount = Math.min(5, confettiCount - currentConfetti);
            for (let i = 0; i < newCount; i++) {
                createConfetti(i * 100);
            }
        }
    }, 2000);
    
    // 在窗口失去焦点时暂停动画，节省性能
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(confettiInterval);
        } else {
            // 恢复动画
            setTimeout(() => {
                initConfetti();
            }, 100);
        }
    });
}

// 初始化祝福语动画 - 轮询显示版本
function initWishes() {
    const wishes = document.querySelectorAll('.wish');
    let currentWish = 0;
    const displayDuration = 2000; // 每条祝福语显示时间
    const fadeDuration = 500;     // 淡入淡出时间
    
    // 重置所有祝福语的样式
    wishes.forEach(wish => {
        wish.style.opacity = '0';
        wish.style.transform = 'translateY(20px)';
        wish.style.transition = `opacity ${fadeDuration}ms ease-in-out, transform ${fadeDuration}ms ease-in-out`;
    });
    
    // 创建轮询函数
    function showNextWish() {
        // 隐藏当前祝福
        wishes[currentWish].style.opacity = '0';
        wishes[currentWish].style.transform = 'translateY(20px)';
        
        // 计算下一个祝福的索引
        currentWish = (currentWish + 1) % wishes.length;
        
        // 显示下一个祝福
        setTimeout(() => {
            wishes[currentWish].style.opacity = '1';
            wishes[currentWish].style.transform = 'translateY(0)';
            
            // 定时显示下一条祝福
            setTimeout(showNextWish, displayDuration);
        }, fadeDuration);
    }
    
    // 立即显示第一条祝福
    setTimeout(() => {
        wishes[0].style.opacity = '1';
        wishes[0].style.transform = 'translateY(0)';
        
        // 设置定时器开始轮询
        setTimeout(showNextWish, displayDuration);
    }, 500);
}

// 增强蜡烛火焰效果
function enhanceFlames() {
    const flames = document.querySelectorAll('.flame');
    
    flames.forEach(flame => {
        // 为每个火焰添加随机的闪烁效果
        const randomDelay = Math.random() * 0.5;
        const randomDuration = Math.random() * 0.5 + 0.5;
        
        flame.style.animationDelay = randomDelay + 's';
        flame.style.animationDuration = randomDuration + 's';
        
        // 创建火焰的光芒效果
        const glow = document.createElement('div');
        glow.classList.add('flame-glow');
        glow.style.position = 'absolute';
        glow.style.top = '-25px';
        glow.style.left = '50%';
        glow.style.transform = 'translateX(-50%)';
        glow.style.width = '30px';
        glow.style.height = '30px';
        glow.style.background = 'radial-gradient(circle, rgba(255,235,59,0.6) 0%, rgba(255,87,34,0.3) 50%, rgba(255,87,34,0) 100%)';
        glow.style.borderRadius = '50%';
        glow.style.animation = 'flame-glow 1s infinite alternate';
        
        flame.parentNode.appendChild(glow);
    });
    
    // 添加火焰光芒动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flame-glow {
            0% { transform: translateX(-50%) scale(1); opacity: 0.7; }
            100% { transform: translateX(-50%) scale(1.2); opacity: 0.9; }
        }
    `;
    document.head.appendChild(style);
}

// 添加蛋糕弹跳动画
function addCakeAnimation() {
    const cake = document.querySelector('.cake');
    
    // 添加弹跳动画
    cake.style.animation = 'cake-bounce 3s infinite';
    
    // 添加蛋糕弹跳动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cake-bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
            40% { transform: translateX(-50%) translateY(-10px); }
            60% { transform: translateX(-50%) translateY(-5px); }
        }
    `;
    document.head.appendChild(style);
}

// 添加触摸设备的特殊处理
function handleTouchDevices() {
    // 检测是否为触摸设备
    const isTouchDevice = 'ontouchstart' in document.documentElement;
    
    if (isTouchDevice) {
        // 触摸设备上添加更多交互效果
        const cake = document.querySelector('.cake');
        
        cake.addEventListener('touchstart', function() {
            cake.style.transform = 'translateX(-50%) scale(1.05)';
        });
        
        cake.addEventListener('touchend', function() {
            cake.style.transform = 'translateX(-50%) scale(1)';
        });
    }
}

// 窗口大小变化时重新调整动画
window.addEventListener('resize', function() {
    // 重置彩带效果
    const decorations = document.querySelector('.decorations');
    decorations.innerHTML = '';
    initConfetti();
});