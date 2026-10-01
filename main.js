/* ==========================================================================
   Royal Print - Professional Order & WhatsApp Confirmation System
   ========================================================================== */
const cart = [];
const WHATSAPP_NUMBER = '201070261283';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initModals();
    initCartLogic();
    initContactForm();
});

/* Nav & Mobile Menu Toggle */
function initNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            const isDisplayed = navLinks.style.display === 'flex';
            if (isDisplayed) {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.right = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(13, 15, 18, 0.98)';
                navLinks.style.padding = '20px';
                navLinks.style.borderBottom = '1px solid var(--border-color)';
            }
        });
    }
}

/* Modals Control */
function initModals() {
    const closeBtns = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('.modal');

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAllModals();
        });
    });
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = 'auto';
}

/* Cart Logic & WhatsApp Order Handling */
function initCartLogic() {
    const addToCartBtns = document.querySelectorAll('.btn-add-cart');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const title = card.querySelector('h3')?.innerText || 'منتج مخصص';
            const select = card.querySelector('select');
            const spec = select ? select.options[select.selectedIndex].text : 'افتراضي';
            const qtyInput = card.querySelector('.qty-input');
            const qty = parseInt(qtyInput?.value || 1, 10);
            const fileInput = card.querySelector('.design-file-input');
            const fileName = fileInput && fileInput.files.length > 0 ? fileInput.files[0].name : null;

            cart.push({
                title,
                spec,
                quantity: qty,
                fileName
            });

            updateCartBadge();
            showToast(`تمت إضافة "${title}" إلى سلة الطلبات!`);
        });
    });

    // فتح نافذة السلة
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            renderCartItems();
            const modal = document.getElementById('cart-modal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // إرسال للواتساب
    document.getElementById('checkout-whatsapp-btn')?.addEventListener('click', sendOrderToWhatsApp);
}

function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.innerText = cart.length;
    }
}

function renderCartItems() {
    const container = document.querySelector('#cart-modal .modal-list');
    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = `<p class="text-muted text-center" style="padding:20px;">سلة الطلبات فارغة حالياً، أضف بعض المنتجات للبدء.</p>`;
        return;
    }

    cart.forEach((item, index) => {
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item-card';
        itemRow.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p><strong>المواصفات:</strong> ${item.spec}</p>
                <p><strong>الكمية:</strong> ${item.quantity}</p>
                ${item.fileName ? `<p class="file-tag"><i class="fas fa-paperclip"></i> الملف المرفق: ${item.fileName}</p>` : ''}
            </div>
            <button onclick="removeCartItem(${index})" class="btn-remove" title="حذف">&times;</button>
        `;
        container.appendChild(itemRow);
    });
}

function removeCartItem(index) {
    cart.splice(index, 1);
    updateCartBadge();
    renderCartItems();
}

function sendOrderToWhatsApp() {
    if (cart.length === 0) {
        alert('السلة فارغة! قم بإضافة بعض المنتجات أولاً.');
        return;
    }

    let message = `مرحباً *رويال برينت* 👋\nأود طلب وتأكيد المطبوعات التالية عبر الموقع:\n\n`;
    
    cart.forEach((item, index) => {
        message += `📦 *طلب رقم (${index + 1}): ${item.title}*\n`;
        message += `• *المواصفات:* ${item.spec}\n`;
        message += `• *الكمية:* ${item.quantity}\n`;
        if (item.fileName) {
            message += `• *الملف المرفق:* ${item.fileName} (سأقوم بإرفاقه بالمحادثة)\n`;
        }
        message += `-----------------------------------\n`;
    });

    message += `\n💬 *يرجى مراجعة الطلب وتأكيد السعر النهائي وموعد الاستلام.*`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
}

/* Custom Toast Notifications */
function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = 'opacity 0.4s ease';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

/* Contact Form handling */
function initContactForm() {
    const form = document.getElementById('main-contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = form.querySelectorAll('.form-input');
            const name = inputs[0].value;
            const phone = inputs[1].value;
            const fileInput = document.getElementById('contact-file-input');
            const details = form.querySelector('textarea').value;

            let message = `مرحباً رويال برينت 👋\nلديك استفسار / طلب خاص جديد:\n\n`;
            message += `👤 *الاسم:* ${name}\n`;
            message += `📞 *رقم الهاتف:* ${phone}\n`;
            if (fileInput && fileInput.files.length > 0) {
                message += `📎 *ملف/تصميم مرفق:* ${fileInput.files[0].name}\n(سأقوم بإرفاقه حالاً بالمحادثة)\n`;
            }
            message += `💬 *التفاصيل:* ${details}\n`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

            window.open(whatsappURL, '_blank');
            form.reset();
        });
    }
}