$( document ).ready(function() {

$(".h2").click(function() {
    var myid = $( this ).attr("id");
    var divid = '#i' + myid;
    $(divid).toggle();
});

});