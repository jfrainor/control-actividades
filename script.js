document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const modalContent = document.querySelector(".modal-content");
  const activityForm = document.getElementById("activity-form");
  const activityList = document.getElementById("activity-list");
  const addActivityButton = document.getElementById("add-activity");
  const closeButton = document.querySelector(".close");

  let activities = [];

  // Cargar actividades desde el archivo JSON al iniciar la aplicación
  function loadActivities() {
    fetch("activities.json")
      .then((response) => response.json())
      .then((data) => {
        activities = data;
        updateActivityList();
      })
      .catch((error) => console.error("Error al cargar actividades:", error));
  }

  loadActivities(); // Cargar actividades al inicio

  // Mostrar el modal para agregar una nueva actividad
  addActivityButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Cerrar el modal
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Agregar una nueva actividad
  activityForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const description = document.getElementById("description").value;
    const days = document.getElementById("days").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const responsible = document.getElementById("responsible").value;

    if (description && days && startDate && endDate && responsible) {
      const activity = {
        description,
        days,
        startDate,
        endDate,
        responsible,
      };

      activities.push(activity);
      saveActivitiesToJSON();
      updateActivityList();
      modal.style.display = "none";
      activityForm.reset();
    }
  });

  // Actualizar la lista de actividades
  function updateActivityList() {
    activityList.innerHTML = "";
    activities.forEach((activity, index) => {
      const activityItem = document.createElement("div");
      activityItem.className = "activity-item";
      activityItem.innerHTML = `
        <p><strong>Descripción:</strong> ${activity.description}</p>
        <p><strong>Cantidad de Días:</strong> ${activity.days}</p>
        <p><strong>Fecha de Inicio:</strong> ${activity.startDate}</p>
        <p><strong>Fecha de Fin:</strong> ${activity.endDate}</p>
        <p><strong>Responsable:</strong> ${activity.responsible}</p>
        <button onclick="editActivity(${index})">Editar</button>
        <button onclick="deleteActivity(${index})">Eliminar</button>
      `;
      activityList.appendChild(activityItem);
    });
  }

  // Editar una actividad
  window.editActivity = (index) => {
    const activity = activities[index];
    modal.style.display = "block";
    document.getElementById("description").value = activity.description;
    document.getElementById("days").value = activity.days;
    document.getElementById("startDate").value = activity.startDate;
    document.getElementById("endDate").value = activity.endDate;
    document.getElementById("responsible").value = activity.responsible;
  
    const originalActivity = { ...activity }; // Copia de la actividad original
  
    activityForm.onsubmit = function (e) {
      e.preventDefault(); // Evita el envío del formulario
      activity.description = document.getElementById("description").value;
      activity.days = document.getElementById("days").value;
      activity.startDate = document.getElementById("startDate").value;
      activity.endDate = document.getElementById("endDate").value;
      activity.responsible = document.getElementById("responsible").value;
  
      saveActivitiesToJSON();
      updateActivityList();
      modal.style.display = "none";
  
      // Restaurar la actividad original
      activities[index] = originalActivity;
  
      // Limpieza de la función onsubmit
      activityForm.onsubmit = function (e) {
        e.preventDefault(); // Evita la ejecución del formulario
      };
    };
  };
  
  

  // Eliminar una actividad
  window.deleteActivity = (index) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta actividad?")) {
      activities.splice(index, 1);
      saveActivitiesToJSON();
      updateActivityList();
    }
  };

  // Guardar actividades en el archivo JSON
  function saveActivitiesToJSON() {
    fetch("activities.json", {
      method: "POST",
      body: JSON.stringify(activities),
    })
      .then(() => console.log("Actividades guardadas en el archivo JSON"))
      .catch((error) => console.error("Error al guardar actividades:", error));
  }
});
