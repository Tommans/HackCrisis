
$(document).ready( function() {

    $.validator.setDefaults({
        errorElement: "label",
        errorPlacement: function ( error, element ) {
            // Add the `help-block` class to the error element
            error.addClass( "invalid-feedback" );

            if ( element.prop( "type" ) === "checkbox" ) {
                error.insertAfter( element.parent( "label" ) );
            } else {
                error.insertAfter( element );
            }
        },
        highlight: function ( element, errorClass, validClass ) {
            $( element ).addClass( "is-invalid" ).removeClass( "is-valid" );
        },
        unhighlight: function (element, errorClass, validClass) {
            $( element ).addClass( "is-valid" ).removeClass( "is-invalid" );
        }
    });

    $('#forma_1').validate();
    $('#forma_2').validate();

    $("#forma_1").submit(function(event) {
        event.preventDefault();

        if ($("#forma_1").valid()) {

            wyslij_dane_1();

        }
    });

    $("#forma_2").submit(function(event) {
        event.preventDefault();

        if ($("#forma_2").valid()) {

            wyslij_dane_2();

        }
    });

function  wyslij_dane_1() {

    $.ajax({
        type: "POST",
        data: {
            forma_1: $("#forma_1").serialize()
        },
        url: "proc_forms.php",
        success: function (data) {

            if (data == 'ok') {
               $(".forma").addClass('d-none');
               $(".karta").removeClass('d-none');
                $("#forma_1")[0].reset();
                $("#forma_1 :input").removeClass('is-valid');

                $("#powiadomienie").removeClass('d-none').show().html("<label>Thank you, someone will call you soon :-)</label>");
                setTimeout(function() {
                    $('#powiadomienie').fadeOut('slow',function(){

                        $("#forma_1 :input").removeClass('is-valid');
                    });
                },3000);
            }
        },
        error: function () {

        }

    });
}

    function  wyslij_dane_2() {

                 var string=$("#kodpocztowy").val();
                 if (!string)
                 {
                        string='null';
                 }
        $.ajax({
            type: "POST",
            data: {
                kod_pocztowy:string
            },
            url: "proc_forms.php",
            success: function (data) {


               if (data!='')
               {
                    var dane=JSON.parse(data);
                    console.log(dane);
                    $("#powiadomienie").removeClass('d-none').show().html("<label>You can call to <b>"+dane.nazwa+"</b>, phone number: <b>"+dane.tel+"</b><br> message from <b>"+dane.nazwa+"</b>: "+dane.msg+"</label>");
                    $("#forma_div_2").addClass("d-none");
                   $("#karta_2").removeClass('d-none');
                   $("#forma_2")[0].reset();
                   $("#forma_2 :input").removeClass('is-valid');
                   $("#col-karta-1").removeClass('col-karta-1');
                   $("#col-karta-2").removeClass('col-karta-2');
               }
            },
            error: function () {

            }

        });
    }



    $('#karta_1').on('click',function () {

        $("#powiadomienie").hide();
        var forma=$('#forma_div_2');

        if (forma.hasClass('d-none'))
        {
            forma.removeClass('d-none');
            $('#karta_2').addClass('d-none');
            $("#col-karta-1").addClass('col-karta-1');
            $("#col-karta-2").addClass('col-karta-2');
        }
    });


    $('#karta_2').on('click',function () {

        $("#powiadomienie").hide();
        var forma=$('#forma_div_1');

        if (forma.hasClass('d-none'))
        {
            forma.removeClass('d-none');
            $("#karta_1").addClass('d-none');
        }
    });


    $('.kodPocztowy').mask('00-000');
    $('#numerTel').mask('000-000-000');

    $( ".karta" ).hover(
        function() {
            $(this).addClass('shadow-lg').css('cursor', 'pointer');
        }, function() {
            $(this).removeClass('shadow-lg');
        }
    );



});