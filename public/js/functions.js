function invite(e) {
    const btn = e.target;
    const id = btn.getAttribute('data-id');

    $.ajax({
        url: "/users/friends/request",
        type: "post",
        async: true,
        data: {
            from: $('#user_id').attr('data-id'),
            to: id,
        },
        success: function (data) {

        },
        error: function (xhr) {
            console.log(xhr)
        }
    });
}


function accepted(e) {
    const btn = e.target;
    const id = btn.getAttribute('data-id');

    $.ajax({
        url: "/users/friends/acceptRequest",
        type: "post",
        async: true,
        data: {
            from: id,
            to: $('#user_id').attr('data-id')
        },
        success: function (data) {
            console.log(data);
        },
        error: function (xhr) {
            console.log(xhr)
        }
    });
}