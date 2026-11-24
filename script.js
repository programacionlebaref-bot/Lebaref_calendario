// ======================================
// VISTA PREVIA DE IMAGEN + GUARDAR
// ======================================

const inputFoto = document.getElementById('foto-evidencia');
const preview = document.getElementById('preview-foto');
const imgPreview = document.getElementById('img-preview');
const nombreFoto = document.getElementById('nombre-foto');

if (inputFoto) {
  inputFoto.addEventListener('change', function () {
      const archivo = this.files[0];
      if (!archivo) return;
      nombreFoto.textContent = archivo.name;
      imgPreview.src = URL.createObjectURL(archivo);
      preview.hidden = false;

      // Guardar la imagen chiquita para que quepa en Firebase
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          const max = 800;
          let w = img.width, h = img.height;
          if (w > max) { h = h * max / w; w = max; }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          const chiquita = canvas.toDataURL('image/jpeg', 0.7);
          localStorage.setItem("imagen", chiquita);
          localStorage.setItem("imagenNombre", archivo.name);
          console.log("Imagen guardada");
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(archivo);
  });
}

document.getElementById('quitar-foto')?.addEventListener('click', function () {
    inputFoto.value = '';
    preview.hidden = true;
    imgPreview.src = '';
    localStorage.removeItem("imagen");
    localStorage.removeItem("imagenNombre");
});
// ======================================
// NAVEGACIÓN FORMULARIO / CALENDARIO
// ======================================

const formContent = document.querySelector('.form-content');
const calendarContent = document.getElementById('calendarContent');

const openCalendar = document.getElementById('openCalendar');
const backToForm = document.getElementById('backToForm');

const steps = document.querySelectorAll('.sidebar .step');
const calendarFrame = document.getElementById('calendarFrame');

// ABRIR CALENDARIO

openCalendar.addEventListener('click', function () {

    // ===== ESTO ES LO QUE FALTABA - GUARDAR ANTES DE ABRIR =====
    const nombre = document.getElementById("nombre").value.trim();
    const empresa = document.getElementById("empresa").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const especialidad = document.getElementById("especialidad").value;
    const descripcion = document.getElementById("descripcion").value.trim();

    if (!nombre || !empresa || !correo || !telefono || !especialidad || !descripcion) {
      alert("Por favor completa todos los campos antes de abrir el calendario");
      return;
    }

    // Estos nombres son IGUAL a los que busca calendario.html
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("empresa", empresa);
    localStorage.setItem("correo", correo);
    localStorage.setItem("telefono", telefono);
    localStorage.setItem("especialidad", especialidad);
    localStorage.setItem("descripcion", descripcion);

    console.log("Guardado:", nombre, correo);
    // ===== FIN DEL GUARDADO =====

    formContent.hidden = true;
    calendarContent.hidden = false;

    // Paso 1 oscurecido
    steps[0].classList.remove('active');

    // Paso 2 resaltado
    steps[1].classList.add('active');

    // Recargar el iframe para que lea lo que acabamos de guardar
    if (calendarFrame) calendarFrame.src = "calendario.html";

    // Ajustar el calendario cuando ya sea visible
    requestAnimationFrame(function () {
        ajustarCalendario();
        calendarContent.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// REGRESAR AL FORMULARIO

backToForm.addEventListener('click', function () {

    calendarContent.hidden = true;
    formContent.hidden = false;

    // Restaurar paso 1
    steps[1].classList.remove('active');
    steps[0].classList.add('active');

    formContent.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// AJUSTAR ALTURA DEL IFRAME

function ajustarCalendario() {
    try {
        const documento = calendarFrame.contentDocument;

        if (documento && documento.documentElement) {
            const altura = documento.documentElement.scrollHeight;
            calendarFrame.style.height = (altura + 30) + 'px';
        }
    } catch (error) {
        console.log('No se pudo ajustar la altura del calendario.');
    }
}

calendarFrame?.addEventListener('load', ajustarCalendario);
window.addEventListener('resize', ajustarCalendario);
