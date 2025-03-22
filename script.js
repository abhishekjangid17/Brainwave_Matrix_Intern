document.addEventListener("DOMContentLoaded", function () {
    const planner = document.querySelector(".planner");
    const saveButtons = document.querySelectorAll(".save-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const datePicker = document.getElementById("date-picker");

    let draggedItem = null;

    // Set default date to today
    const today = new Date().toISOString().split("T")[0];
    datePicker.value = localStorage.getItem("selectedDate") || today;

    // Function to get storage key based on selected date
    function getStorageKey(hour) {
        return `${datePicker.value}-hour-${hour}`;
    }

    // Save task order in localStorage
    function saveTaskOrder() {
        const taskOrder = Array.from(planner.children).map(block => block.id);
        localStorage.setItem(`${datePicker.value}-taskOrder`, JSON.stringify(taskOrder));
    }

    // Load task order from localStorage
    function loadTaskOrder() {
        const savedOrder = JSON.parse(localStorage.getItem(`${datePicker.value}-taskOrder`));
        if (savedOrder) {
            savedOrder.forEach(hourId => {
                const block = document.getElementById(hourId);
                if (block) {
                    planner.appendChild(block);
                }
            });
        }
    }

    // Update task background colors based on the time
    function updateTaskColors() {
        const currentHour = new Date().getHours();
        document.querySelectorAll(".time-block").forEach(block => {
            const blockHour = parseInt(block.id.split("-")[1]);
            block.classList.remove("past", "present", "future");

            if (blockHour < currentHour) {
                block.classList.add("past");
            } else if (blockHour === currentHour) {
                block.classList.add("present");
            } else {
                block.classList.add("future");
            }
        });
    }

    // Save task to localStorage
    function saveTask(event) {
        const block = event.target.closest(".time-block");
        const hour = block.id.split("-")[1];
        const task = block.querySelector(".task").value;
        localStorage.setItem(getStorageKey(hour), task);
    }

    // Delete task from localStorage
    function deleteTask(event) {
        const block = event.target.closest(".time-block");
        const hour = block.id.split("-")[1];
        block.querySelector(".task").value = "";
        localStorage.removeItem(getStorageKey(hour));
    }

    // Load tasks based on selected date
    function loadTasks() {
        document.querySelectorAll(".time-block").forEach(block => {
            const hour = block.id.split("-")[1];
            block.querySelector(".task").value = localStorage.getItem(getStorageKey(hour)) || "";
        });
    }

    // Handle date change
    function handleDateChange() {
        localStorage.setItem("selectedDate", datePicker.value);
        loadTasks();
        loadTaskOrder();
    }

    // Dark mode toggle
    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    }

    function loadDarkMode() {
        if (localStorage.getItem("darkMode") === "true") {
            document.body.classList.add("dark-mode");
        }
    }

    // Drag & Drop Functions
    function handleDragStart(event) {
        draggedItem = event.target;
        event.target.classList.add("dragging");
    }

    function handleDragOver(event) {
        event.preventDefault();
        const afterElement = getDragAfterElement(planner, event.clientY);
        if (afterElement == null) {
            planner.appendChild(draggedItem);
        } else {
            planner.insertBefore(draggedItem, afterElement);
        }
    }

    function handleDragEnd(event) {
        event.target.classList.remove("dragging");
        saveTaskOrder();
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".time-block:not(.dragging)")];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Event Listeners
    saveButtons.forEach(button => button.addEventListener("click", saveTask));
    deleteButtons.forEach(button => button.addEventListener("click", deleteTask));
    datePicker.addEventListener("change", handleDateChange);
    darkModeToggle.addEventListener("click", toggleDarkMode);
    planner.addEventListener("dragover", handleDragOver);

    document.querySelectorAll(".time-block").forEach(block => {
        block.addEventListener("dragstart", handleDragStart);
        block.addEventListener("dragend", handleDragEnd);
    });

    // Initial Load
    updateTaskColors();
    loadTasks();
    loadTaskOrder();
    loadDarkMode();
});
