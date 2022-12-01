$(function(){
    $("#task-result").hide()
    fetchTasks()
    let edit = false

    $("#search").keyup(()=>{
        if($("#search").val()){
            let search = $("#search").val();
            $.ajax({
                url: "php/buscar-tarea.php",
                data: { search },
                type: "POST",
                success: function (response) {
                    if(!response.error) {
                        let tasks = JSON.parse(response);
                        let template = ``;
                        tasks.forEach(task => {
                            template += `<li class="task-item">${task.name}</li>`
                        });
                        $("#task-result").show();
                        $("#container").html(template);
                    }
                }
            })
        }
    })

    $("#task-form").submit(e => {
        e.preventDefault();
        const postData = {
            name: $("#name").val(),
            description: $("#description").val(),
            id: $("#taskId").val()
        }

        const url = edit === false ? "php/agregar-tarea.php" : "php/editar-tarea.php";

        $.ajax({
            url,
            data: postData,
            type: "POST",
            success: function (response) {
                if(!response.error){
                    fetchTasks();
                    $("#task-form").trigger("reset")
                }
            }
        })
    })

    function fetchTasks() {
        $.ajax({
            url: "php/listar-tareas.php",
            type: "GET",
            success: function(response){
                const tasks = JSON.parse(response);
                let template = ``;
                tasks.forEach(task => 
                    {
                        template += `
                        <tr taskId="${task.id}">
                            <td>${task.id}</td>
                            <td>${task.name}</td>
                            <td>${task.description}</td>
                            <td>
                                <button class="btn btn-danger task-delete">Eliminar</button>
                                <button class="btn btn-warning task-item">Modificar</button>
                            </td>
                        </tr>
                        `;
                    })
                $("#tasks").html(template);
            }
        })
    }

    $(document).on("click", ".task-delete", ()=>{
        if(confirm("¿Seguroski que quieres eliminar esa tarea?")){
            const element = $(this)[0].activeElement.parentElement.parentElement;
            const id = $(element).attr("taskId")
            $.post("php/eliminar-tarea.php", { id }, () => {
                fetchTasks()
            })
        }
    })

    $(document).on("click", ".task-item", ()=>{
        const element = $(this)[0].activeElement.parentElement.parentElement;
        const id = $(element).attr("taskId")
        let url = "php/obtener-una-tarea.php"
        $.ajax({
            url,
            data: {id},
            type: "POST",
            success: function(response){
                if(!response.error){
                    const task = JSON.parse(response)
                    $("#name").val(task.name)
                    $("#description").val(task.description)
                    $("#taskId").val(task.id)
                    edit = true
                }
            }
        })
    })

})