"use strict";
var Token = /** @class */ (function () {
    function Token(lexema, descripcion, id_token, fila, columna) {
        this.lexema = "";
        this.descripcion = "";
        this.id_token = 0;
        this.fila = 0;
        this.columna = 0;
        this.id_token = id_token;
        this.descripcion = descripcion;
        this.lexema = lexema;
        this.fila = fila;
        this.columna = columna;
    }
    return Token;
}());
var lista_token = new Array();
var lista_EL = new Array();
var lista_Com = new Array();
var texto_py = "";
var consola_html = "";
var switcher = "";
var Lex = /** @class */ (function () {
    function Lex() {
    }
    Lex.prototype.analizar = function () {
        lista_ES = new Array();
        lista_Com = new Array();
        lista_EL = new Array();
        lista_token = new Array();
        lista_variables = new Array();
        texto_py = "";
        consola_html = "";
        var fila = 0, columna = 0, estado_actual = 0, id_token = -1, decimal = 0;
        var lexema = "", descripcion = "";
        var entrada = document.getElementById("entrada").value;
        for (var f = 0; f < entrada.length; f++) {
            var c_actual = void 0, c_siguiente = -1;
            c_actual = entrada.charCodeAt(f);
            console.log(entrada.charAt(f) + "-" + c_actual);
            if (estado_actual == 0) {
                estado_actual = this.transicion(c_actual);
            }
            try {
                c_siguiente = entrada.charCodeAt(f + 1);
            }
            catch (error) {
            }
            switch (estado_actual) {
                case 10:
                    console.log("espacio abajo");
                    estado_actual = -2;
                    fila++;
                    break;
                case 39:
                    try {
                        lexema = lexema + entrada.charAt(f);
                        f++;
                        lexema = lexema + entrada.charAt(f);
                        if (entrada.charCodeAt(f + 1) == 39) {
                            f++;
                            id_token = 824;
                            descripcion = "caracter";
                            estado_actual = 0;
                        }
                        else {
                            f++;
                            estado_actual = 829;
                        }
                    }
                    catch (error) {
                        estado_actual = 2020;
                    }
                case 34:
                    lexema = lexema + entrada.charAt(f);
                    if (c_actual == 10) {
                        fila++;
                        columna = 0;
                    }
                    if (c_siguiente == 34) {
                        lexema = lexema + entrada.charAt(f + 1);
                        f++;
                        id_token = 822;
                        descripcion = "cadena";
                        estado_actual = 0;
                    }
                    else if (f == entrada.length - 1) {
                        lexema = lexema + "\"";
                        id_token = 822;
                        descripcion = "cadena";
                        estado_actual = 0;
                    }
                    break;
                case 829:
                    lexema = lexema + entrada.charAt(f);
                    if (c_actual == 10) {
                        fila++;
                        columna = 0;
                    }
                    if (c_siguiente == 39) {
                        lexema = lexema + entrada.charAt(f + 1);
                        f++;
                        id_token = 829;
                        descripcion = "texto-HTML";
                        estado_actual = 0;
                    }
                    else if (f == entrada.length - 1) {
                        lexema = lexema + "'";
                        id_token = 829;
                        descripcion = "texto-HTML";
                        estado_actual = 0;
                    }
                    break;
                case 47:
                    lexema = lexema + entrada.charAt(f);
                    if (c_siguiente == 47) {
                        estado_actual = 820;
                    }
                    else if (c_siguiente == 42) {
                        estado_actual = 821;
                    }
                    else {
                        id_token = 47;
                        descripcion = "simbolo";
                        estado_actual = 0;
                    }
                    break;
                case 95:
                    lexema = lexema + entrada.charAt(f);
                    if (this.es_identificador(c_siguiente)) {
                        estado_actual = 818;
                    }
                    else {
                        id_token = c_actual;
                        descripcion = "simbolo";
                        estado_actual = 0;
                    }
                    break;
                case 818:
                    lexema = lexema + entrada.charAt(f);
                    if (this.es_identificador(c_siguiente)) {
                        estado_actual = 818;
                    }
                    else {
                        id_token = this.es_reservada(lexema);
                        if (id_token == 818) {
                            descripcion = "identificador";
                        }
                        else {
                            descripcion = "palabra reservada";
                        }
                        estado_actual = 0;
                    }
                    break;
                case 819:
                    lexema = lexema + entrada.charAt(f);
                    if ((c_siguiente > 47 && c_siguiente < 58) || (c_siguiente == 46 && decimal == 0)) {
                        if (c_siguiente == 46) {
                            decimal = 1;
                        }
                        if (decimal == 1) {
                            decimal = 2;
                        }
                        estado_actual = 819;
                    }
                    else {
                        if (decimal == 0) {
                            descripcion = "numero";
                            id_token = 819;
                            estado_actual = 0;
                        }
                        else if (decimal == 2) {
                            descripcion = "decimal";
                            id_token = 823;
                            decimal = 0;
                            estado_actual = 0;
                        }
                        else {
                            estado_actual = 2020;
                            decimal = 0;
                        }
                    }
                    break;
                case 820:
                    lexema = lexema + entrada.charAt(f);
                    if (c_siguiente == 10 || f == entrada.length - 1) {
                        estado_actual = 0;
                        id_token = 820;
                        descripcion = "comentario una linea";
                    }
                    break;
                case 821:
                    lexema = lexema + entrada.charAt(f);
                    if (entrada.charCodeAt(f) == 10) {
                        fila++;
                        columna = 0;
                    }
                    try {
                        if (entrada.charCodeAt(f) == 42) {
                            if (entrada.charCodeAt(f + 1) == 47) {
                                lexema = lexema + entrada.charAt(f + 1);
                                f++;
                                descripcion = "comentario multilinea";
                                estado_actual = 0;
                                id_token = 821;
                            }
                        }
                        else if (f == entrada.length - 1) {
                            lexema = lexema + "*/";
                            descripcion = "comentario multilinea";
                            estado_actual = 0;
                            id_token = 821;
                        }
                    }
                    catch (error) {
                        lexema = lexema + "/";
                        descripcion = "comentario multilinea";
                        estado_actual = -2;
                        id_token = 821;
                    }
                    break;
                case 2019:
                    estado_actual = -2;
                    break;
                case 2020:
                    if (lexema == "") {
                        lexema = lexema + entrada.charAt(f);
                    }
                    // agregando errores lexicos
                    descripcion = "Error lexico, caracter no definido en el lenguaje";
                    lista_EL.push(new Token(lexema, descripcion, 2020, fila, columna));
                    lexema = "";
                    descripcion = "";
                    estado_actual = -2;
                    break;
                default:
                    lexema = lexema + entrada.charAt(f);
                    id_token = estado_actual;
                    descripcion = "simbolo";
                    estado_actual = 0;
                    break;
            }
            if (estado_actual == 0) {
                lista_token.push(new Token(lexema, descripcion, id_token, fila, columna));
                // console.log(lexema + "-" + descripcion);
                lexema = "";
                descripcion = "";
            }
            if (estado_actual == -2) {
                estado_actual = 0;
                /* lexema = "";
                 descripcion = "";*/
            }
            columna++;
        }
        var i = 0;
        lista_token.forEach(function (value) {
            console.log(i + "-" + value.lexema);
            i++;
        });
        lista_EL.forEach(function (value) {
            console.log(value);
        });
        var sn = new Sintact();
        sn.analizar_token();
    };
    ///defincion de palabras reservadas con su respectico id de token
    Lex.prototype.es_reservada = function (lexema) {
        switch (lexema) {
            case "int":
                return 800;
            case "double":
                return 801;
            case "char":
                return 802;
            case "bool":
                return 803;
            case "string":
                return 804;
            case "void":
                return 805;
            case "main":
                return 806;
            case "Console":
                return 807;
            case "Write":
                return 808;
            case "if":
                return 809;
            case "else":
                return 810;
            case "switch":
                return 811;
            case "for":
                return 812;
            case "while":
                return 813;
            case "do":
                return 814;
            case "return":
                return 815;
            case "break":
                return 816;
            case "continue":
                return 817;
            case "true":
                return 825;
            case "false":
                return 826;
            case "case":
                return 827;
            case "default":
                return 828;
            default:
                return 818;
        }
    };
    Lex.prototype.es_identificador = function (numero) {
        if ((numero > 96 && numero < 123) || (numero > 64 && numero < 91)
            || (numero > 47 && numero < 58) || numero == 95) {
            return true;
        }
        else {
            return false;
        }
    };
    Lex.prototype.transicion = function (numero) {
        if (this.es_caracter(numero) == true) {
            return numero;
        }
        if ((numero > 96 && numero < 123) || (numero > 64 && numero < 91)) {
            return 818;
        }
        else if (numero > 47 && numero < 58) {
            return 819;
        }
        else if (numero == 32 || numero == 13 || numero == 9) {
            return 2019;
        }
        return 2020;
    };
    Lex.prototype.es_caracter = function (numero) {
        var aceptado = false;
        var caracateres = [10, 33, 34, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62, 95, 123, 124, 125];
        caracateres.forEach(function (value) {
            if (value == numero) {
                aceptado = true;
            }
        });
        return aceptado;
    };
    return Lex;
}());
/*ANALISIS SINTACTICO*/
var lista_ES = new Array();
var lista_variables = new Array();
var index = 0;
var esta_recuperado = true;
var Sintact = /** @class */ (function () {
    function Sintact( /*lt:Array<Token>, lES:Array<Token>*/) {
        /*lista_token = lt;
        lista_EL = lES;*/
    }
    Sintact.prototype.analizar_token = function () {
        index = 0;
        var analizado = true;
        while (index < lista_token.length) {
            if (analizado == false) {
                this.sentencias(59, 125, "\t");
            }
            else {
                if (this.es_tipo_de_dato() || lista_token[index].id_token == 805) {
                    if (lista_token[index + 1].id_token == 818) {
                        if (lista_token[index + 2].id_token == 40) {
                            analizado = this.declaracion_metodo("");
                        }
                        else if (lista_token[index].id_token != 805) {
                            analizado = this.declaracion_variable("");
                        }
                        else {
                            this.capturar_error("Id");
                            analizado = false;
                        }
                    }
                    else if (lista_token[index + 1].id_token == 806) {
                        if (lista_token[index + 2].id_token == 40) {
                            analizado = this.declaracion_metodo("");
                        }
                        else {
                            this.capturar_error("Id");
                            analizado = false;
                        }
                    }
                }
                else {
                    if (lista_token[index].id_token == 820 || lista_token[index].id_token == 821) {
                        var coment = lista_token[index].lexema;
                        coment = coment.replace("//", "#");
                        coment = coment.replace("/*", "'''");
                        coment = coment.replace("*/", "'''");
                        texto_py = texto_py + coment;
                        analizado = true;
                        this.consumir();
                    }
                    else {
                        this.capturar_error("Definicion de metodo");
                        analizado = true;
                    }
                }
            }
        }
        lista_ES.forEach(function (value) {
            console.log(value);
        });
        this.crear_tablas(lista_variables, "div_tb_var");
        this.crear_tablas(lista_ES, "div_tb_es");
        this.crear_tablas(lista_EL, "div_tb_el");
        document.getElementById("txt_consolapy").value = texto_py;
        var prueba = "";
        for (var d = 0; d < consola_html.length; d++) {
            if (consola_html.charCodeAt(d) != 39) {
                prueba = prueba + consola_html.charAt(d);
            }
        }
        document.getElementById("txt_consolahtml").value = prueba;
        this.convertir_html_json(prueba);
    };
    Sintact.prototype.convertir_html_json = function (text) {
        text = text.toUpperCase();
        console.log(text);
        text = text.replace("'", "");
        text = text.replace("<HEAD>", "\"HEAD\":{");
        text = text.replace("</HEAD>", "\n}");
        text = text.replace("<H1>", "\"H1\":{\n\"TEXTO\":\"");
        text = text.replace("</H1>", "\"\n}");
        text = text.replace("<H2>", "\"H2\":{\n\"TEXTO\":\"");
        text = text.replace("</H2>", "\"\n}");
        text = text.replace("<H3>", "\"H3\":{\n\"TEXTO\":\"");
        text = text.replace("</H3>", "\"\n}");
        text = text.replace("<H4>", "\"H4\":{\n\"TEXTO\":\"");
        text = text.replace("</H4>", "\"\n}");
        text = text.replace("<P>", "\"P\":{\n\"TEXTO\":\"");
        text = text.replace("</P>", "\"\n}");
        text = text.replace("<BUTTON>", "\"BUTTON\":{\n\"TEXTO\":\"");
        text = text.replace("</BUTTON>", "\"\n}");
        text = text.replace("<BR>", "\"BR\":{\n:");
        text = text.replace("</BR>", "\"\n}");
        text = text.replace("<LABEL>", "\"LABEL\":{\n\"TEXTO\":\"");
        text = text.replace("</LABEL>", "\"\n}");
        text = text.replace("<TITLE>", "\"TITLE\":{\n\"TEXTO\":\"");
        text = text.replace("</TITLE>", "\"\n}");
        text = text.replace("<INPUT>", "\"INPUT\":{\n\"TEXTO\":\"");
        text = text.replace("</INPUT>", "\"\n}");
        text = text.replace("<HTML>", "\"HTML\":{");
        text = text.replace("<BODY>", "\"BODY\":{");
        text = text.replace("</BODY>", "\n}");
        text = text.replace("</HTML>", "\n}");
        text = text.replace("<BODY STYLE=\"BACKGROUND:", "\"BODY\":{\n\"STYLE\":\"background:");
        text = text.replace("<BODY STYLE=\"BACKGROUND:", "\"STYLE\":\"background:");
        document.getElementById("txt_consolajson").value = text;
    };
    Sintact.prototype.sentencias = function (num1, num2, tab) {
        num1 = num2 = 59;
        var analizado = false;
        try {
            if (lista_token[index].id_token == 820 || lista_token[index].id_token == 821) {
                var coment = lista_token[index].lexema;
                coment = coment.replace("//", "#");
                coment = coment.replace("/*", "'''");
                coment = coment.replace("*/", "'''");
                texto_py = texto_py + coment;
                analizado = true;
                this.consumir();
            }
            else {
                if (lista_token[index].id_token == 807) {
                    analizado = this.sentencia_imprimir(tab);
                }
                else if (lista_token[index].id_token == 809) {
                    analizado = this.sentencia_if(tab, 0);
                }
                else if (lista_token[index].id_token == 811) {
                    analizado = this.sentencia_swtich(tab);
                }
                else if (lista_token[index].id_token == 812) {
                    analizado = this.sentencia_for(tab);
                }
                else if (lista_token[index].id_token == 813) {
                    analizado = this.sentencia_while(tab);
                }
                else if (lista_token[index].id_token == 814) {
                    analizado = this.sentencia_do_while(tab);
                }
                else if (this.es_tipo_de_dato()) {
                    analizado = this.declaracion_variable(tab);
                }
                else if (lista_token[index].id_token == 818) {
                    if (lista_token[index + 1].id_token == 61) {
                        analizado = this.sentencia_variable_val(tab);
                    }
                    else if (lista_token[index + 1].id_token = 40) {
                        analizado = this.llamada_metodo(tab);
                    }
                }
                else if (lista_token[index].id_token == 815) {
                    analizado = this.sentencia_return(tab);
                }
                else if (lista_token[index].id_token == 816) {
                    analizado = this.sentencia_break(tab);
                }
                else if (lista_token[index].id_token == 817) {
                    analizado = this.sentencia_continue(tab);
                }
                else {
                    this.capturar_error("Sintaxis dentro de metodo");
                }
                if (!analizado) {
                    analizado = this.mode_panik(num1, num2);
                    analizado = false;
                }
            }
        }
        catch (error) {
        }
        return analizado;
    };
    Sintact.prototype.mode_panik = function (num1, num2) {
        try {
            while (lista_token[index].id_token != num1 &&
                lista_token[index].id_token != num2 &&
                index < lista_token.length) {
                this.consumir();
            }
            this.consumir();
        }
        catch (error) {
        }
        return true;
    };
    Sintact.prototype.sentencia_continue = function (tab) {
        if (lista_token[index].id_token == 817) {
            texto_py = texto_py + "\n" + tab + lista_token[index].lexema;
            this.consumir();
        }
        else {
            this.capturar_error("continue");
            return false;
        }
        if (lista_token[index].id_token == 59) {
            this.consumir();
        }
        else {
            this.capturar_error(";");
            return false;
        }
        return true;
    };
    ;
    Sintact.prototype.sentencia_break = function (tab) {
        if (lista_token[index].id_token == 816) {
            texto_py = texto_py + "\n" + tab + lista_token[index].lexema;
            this.consumir();
        }
        else {
            this.capturar_error("break");
            return false;
        }
        if (lista_token[index].id_token == 59) {
            this.consumir();
        }
        else {
            this.capturar_error(";");
            return false;
        }
        return true;
    };
    //####################### SENTENCIA RETURN #############################
    Sintact.prototype.sentencia_return = function (tab) {
        if (lista_token[index].id_token == 815) {
            texto_py = texto_py + "\n" + tab + lista_token[index].lexema;
            this.consumir();
        }
        else {
            this.capturar_error("return");
            return false;
        }
        while (lista_token[index].id_token != 59) {
            if (this.es_valor()) {
                texto_py = texto_py + " " + lista_token[index].lexema;
                this.consumir();
            }
            else {
                this.capturar_error("Valor");
                return false;
            }
            if (this.es_operador()) {
                texto_py = texto_py + " " + lista_token[index].lexema;
                this.consumir();
            }
            else {
                if (lista_token[index].id_token != 59) {
                    this.capturar_error("Operador");
                    return false;
                }
            }
        }
        if (lista_token[index].id_token == 59) {
            this.consumir();
        }
        else {
            this.capturar_error(";");
            return false;
        }
        return true;
    };
    //####################### LLamada a metodo  #############################
    Sintact.prototype.llamada_metodo = function (tab) {
        if (this.es_identificador()) {
            texto_py = texto_py + "\n" + tab + lista_token[index].lexema;
            this.consumir();
        }
        else {
            this.capturar_error("Id");
            return false;
        }
        if (lista_token[index].id_token == 40) {
            texto_py = texto_py + " " + lista_token[index].lexema;
            this.consumir();
        }
        else {
            this.capturar_error("(");
            return false;
        }
        while (lista_token[index].id_token != 59) {
            if (this.es_valor()) {
                texto_py = texto_py + " " + lista_token[index].lexema;
                this.consumir();
            }
            else {
                this.capturar_error("Valor");
                return false;
            }
            if (lista_token[index].id_token == 44) {
                texto_py = texto_py + " " + lista_token[index].lexema;
                this.consumir();
            }
            else {
                if (lista_token[index].id_token != 59) {
                    this.capturar_error(",");
                    return false;
                }
            }
        }
        if (lista_token[index].id_token == 59) {
            this.consumir();
        }
        else {
            this.capturar_error(";");
        }
        return true;
    };
    //####################### SENTENCIA FOR #############################
    Sintact.prototype.sentencia_for = function (tab) {
        var nombre_v = "";
        var tipo_v = "";
        var fila = 0;
        if (lista_token[index].id_token == 812) { // es for
            texto_py = texto_py + "\n" + tab + lista_token[index].lexema;
            this.consumir();
        }
        else {
            this.capturar_error("for");
            return false;
        }
        if (lista_token[index].id_token == 40) { // es abrir parentesis
            this.consumir();
        }
        else {
            this.capturar_error("(");
            return false;
        }
        if (this.es_tipo_de_dato()) {
            tipo_v = lista_token[index].lexema;
            this.consumir();
        }
        else {
            this.capturar_error("Tipo de dato");
            return false;
        }
        if (this.es_identificador()) {
            nombre_v = lista_token[index].lexema;
            texto_py = texto_py + " " + nombre_v + " in range(";
            fila = lista_token[index].fila;
            lista_variables.push(new Token(nombre_v, tipo_v, 0, fila, 0));
            this.consumir();
        }
        else {
            this.capturar_error("Id");
            return false;
        }
        if (lista_token[index].id_token == 61) { //  igual
            this.consumir();
        }
        else {
            this.capturar_error("=");
            return false;
        }
        if (this.es_valor()) {
            texto_py = texto_py + " " + lista_token[index].lexema;
            this.consumir();
        }
        else {
            this.capturar_error("Valor");
            return false;
        }
        if (lista_token[index].id_token == 59) { //punto y coma
            this.consumir();
        }
        else {
            this.capturar_error(";");
            return false;
        }
        if (this.es_identificador()) {
            this.consumir();
        }
        else {
            this.capturar_error("Id");
            return false;
        }
        if (lista_token[index].id_token == 33) {
            this.consumir();
            if (lista_token[index].id_token == 61) {
                this.consumir();
            }
            else {
                this.capturar_error("!=");
                return false;
            }
        }
        else if (lista_token[index].id_token == 60) {
            this.consumir();
            if (lista_token[index].id_token == 61) {
                this.consumir();
            }
        }
        else if (lista_token[index].id_token == 61) {
            this.consumir();
            if (lista_token[index].id_token == 61) {
                this.consumir();
            }
            else {
                this.capturar_error("==");
                return false;
            }
        }
        else if (lista_token[index].id_token == 62) {
            this.consumir();
            if (lista_token[index].id_token == 61) {
                this.consumir();
            }
        }
        else {
            this.capturar_error("Relacionales");
            return false;
        }
        if (this.es_valor()) {
            texto_py = texto_py + " ," + lista_token[index].lexema + "):";
            this.consumir();
        }
        else {
            this.capturar_error("Valor");
            return false;
        }
        if (lista_token[index].id_token == 59) {
            this.consumir();
        }
        else {
            this.capturar_error(";");
            return false;
        }
        if (this.es_identificador()) {
            this.consumir();
        }
        else {
            this.capturar_error("Id");
            return false;
        }
        if (lista_token[index].id_token == 43) {
            this.consumir();
            if (lista_token[index].id_token == 43) {
                this.consumir();
            }
            else {
                this.capturar_error("++");
                return false;
            }
        }
        else if (lista_token[index].id_token == 45) {
            this.consumir();
            if (lista_token[index].id_token == 45) {
                this.consumir();
            }
            else {
                this.capturar_error("--");
                return false;
            }
        }
        else {
            this.capturar_error("Incremento o Decremento");
            return false;
        }
        if (lista_token[index].id_token == 41) {
            this.consumir();
        }
        else {
            this.capturar_error(")");
            return false;
        }
        if (lista_token[index].id_token == 123) {
            this.consumir();
        }
        else {
            this.capturar_error("{");
            return false;
        }
        while (lista_token[index].id_token != 125) {
            //sentencias
            var val = this.sentencias(59, 125, tab + "\t");
            if (!val) {
                return false;
            }
            if (index >= lista_token.length) {
                return false;
            }
        }
        if (lista_token[index].id_token == 125) {
            this.consumir();
        }
        else {
            this.capturar_error("}");
            return false;
        }
        return true;
    };
    //####################### SENTENCIA WHILE #############################
    Sintact.prototype.sentencia_while = function (tab) {
        if (lista_token[index].id_token == 813) {
            texto_py = texto_py + "\n" + tab + lista_token[index].lexema;
            this.consumir();
        }
        else {
            this.capturar_error("while");
            return false;
        }
        if (lista_token[index].id_token == 40) {
            this.consumir();
        }
        else {
            this.capturar_error("(");
            return false;
        }
        while (lista_token[index].id_token != 41) { // != cerrar parentesis
            var val = this.validacion_logica();
            if (!val) {
                return false;
            }
        }
        if (lista_token[index].id_token == 41) {
            this.consumir();
        }
        else {
            this.capturar_error(")");
            return false;
        }
        if (lista_token[index].id_token == 123) {
            texto_py = texto_py + " :";
            this.consumir();
        }
        else {
            this.capturar_error("{");
            return false;
        }
        while (lista_token[index].id_token != 125) {
            ///sentencias
            var val = this.sentencias(59, 125, tab + "\t");
            if (!val) {
                return false;
            }
            if (index >= lista_token.length) {
                return false;
            }
        }
        if (lista_token[index].id_token == 125) {
            this.consumir();
        }
        else {
            this.capturar_error("}");
            return false;
        }
        return true;
    };
    //####################### SENTENCIA DO WHILE #############################
    Sintact.prototype.sentencia_do_while = function (tab) {
        if (lista_token[index].id_token == 814) { /// dooo
            this.consumir();
        }
        else {
            this.capturar_error("do");
            return false;
        }
        if (lista_token[index].id_token == 123) { // abrir llaves
            this.consumir();
        }
        else {
            this.capturar_error("{");
            return false;
        }
        texto_py = texto_py + "\n" + tab + "while True:";
        while (lista_token[index].id_token != 125) {
            ///////////// sentenciass
            var val = this.sentencias(59, 125, tab + "\t");
            if (!val) {
                return false;
            }
            if (index >= lista_token.length) {
                return false;
            }
        }
        if (lista_token[index].id_token == 125) { /// cerrar llaves
            this.consumir();
        }
        else {
            this.capturar_error("}");
            return false;
        }
        if (lista_token[index].id_token == 813) { // palabra while
            this.consumir();
        }
        else {
            this.capturar_error("while");
            return false;
        }
        if (lista_token[index].id_token == 40) { // abrir parentesis
            this.consumir();
        }
        else {
            this.capturar_error("(");
            return false;
        }
        texto_py = texto_py + "\n" + tab + "if(";
        while (lista_token[index].id_token != 41) {
            var val = this.validacion_logica();
            if (!val) {
                return false;
            }
        }
        texto_py = texto_py + "):\n" + tab + "\tbreak";
        if (lista_token[index].id_token == 41) {
            this.consumir();
        }
        else {
            this.capturar_error(")");
            return false;
        }
        if (lista_token[index].id_token == 59) {
            this.consumir();
        }
        else {
            this.capturar_error(";");
            return false;
        }
        return false;
    };
    // ###################### SENTENCIA SWITCH  ###########################
    Sintact.prototype.sentencia_swtich = function (tab) {
        var value = "";
        if (lista_token[index].id_token == 811) { // es switch
            this.consumir();
        }
        else {
            this.capturar_error("switch");
            return false;
        }
        if (lista_token[index].id_token == 40) { // abrir parentesis
            this.consumir();
        }
        else {
            this.capturar_error("(");
            return false;
        }
        if (this.es_identificador()) { // es id
            value = lista_token[index].lexema;
            texto_py = texto_py + "\n" + tab + "def switch(case," + lista_token[index].lexema + "):";
            texto_py = texto_py + "\n" + tab + "\tswitcher = {";
            this.consumir();
        }
        else {
            this.capturar_error("Id");
            return false;
        }
        if (lista_token[index].id_token == 41) { // cerrar parentesis
            this.consumir();
        }
        else {
            this.capturar_error(")");
            return false;
        }
        if (lista_token[index].id_token == 123) { // abrir llave
            this.consumir();
        }
        else {
            this.capturar_error("}");
            return false;
        }
        while (lista_token[index].id_token != 125) { // cerrar llave
            var vino = false;
            if (lista_token[index].id_token == 827) {
                this.consumir();
                if (this.es_valor()) {
                    texto_py = texto_py + "\n\t" + tab + lista_token[index].lexema + ":";
                    this.consumir();
                }
                else {
                    this.capturar_error("Valor");
                    return false;
                }
                vino = true;
            }
            else if (lista_token[index].id_token == 828) {
                texto_py = texto_py + "\n\t" + tab + lista_token[index].lexema + ":";
                this.consumir();
                vino = true;
            }
            if (vino) {
                if (lista_token[index].id_token == 58) {
                    this.consumir();
                }
                else {
                    this.capturar_error(":");
                    return false;
                }
                while (lista_token[index].id_token != 125 && lista_token[index].id_token != 816 &&
                    lista_token[index].id_token != 815 && lista_token[index].id_token != 827 &&
                    lista_token[index].id_token != 828) {
                    // sentencias
                    var val = this.sentencias(59, 125, tab + "\t\t");
                    if (!val) {
                        return false;
                    }
                    if (index >= lista_token.length) {
                        return false;
                    }
                    texto_py = texto_py + ",";
                }
                if (lista_token[index].id_token == 815 || lista_token[index].id_token == 816) {
                    this.consumir();
                    if (lista_token[index].id_token == 59) {
                        this.consumir();
                    }
                    else {
                        this.capturar_error(";");
                        return false;
                    }
                }
                else {
                    if (lista_token[index].id_token != 827
                        && lista_token[index].id_token != 828
                        && lista_token[index].id_token != 125) {
                        this.capturar_error("Case o }");
                        return false;
                    }
                }
            }
        }
        if (lista_token[index].id_token == 125) {
            texto_py = texto_py + "\n" + tab + "}";
            this.consumir();
        }
        else {
            this.capturar_error("}");
            return false;
        }
        return true;
    };
    // ###################### SENTENCIA IMPRIMIR  ###########################    
    Sintact.prototype.sentencia_imprimir = function (tab) {
        if (lista_token[index].id_token == 807) { //Console
            texto_py = texto_py + "\n" + tab + "print(";
            this.consumir();
        }
        else {
            this.capturar_error("Console");
            return false;
        }
        if (lista_token[index].id_token == 46) { //Punto
            this.consumir();
        }
        else {
            this.capturar_error(".");
            return false;
        }
        if (lista_token[index].id_token == 808) { //Write
            this.consumir();
        }
        else {
            this.capturar_error("Write");
            return false;
        }
        if (lista_token[index].id_token == 40) { //abrir parentesis
            this.consumir();
        }
        else {
            this.capturar_error("(");
            return false;
        }
        while (lista_token[index].id_token != 41) { // !cerrar parentesis
            if (this.es_valor()) {
                texto_py = texto_py + " " + lista_token[index].lexema;
                if (lista_token[index].id_token == 829) {
                    consola_html = consola_html + "\n" + lista_token[index].lexema;
                }
                this.consumir();
            }
            else {
                this.capturar_error("Valor");
                return false;
            }
            if (lista_token[index].id_token == 43) {
                texto_py = texto_py + ",";
                this.consumir();
            }
            else if (lista_token[index].id_token != 41 && !this.es_valor()) {
                this.capturar_error(")");
                return false;
            }
            else if (this.es_valor()) {
                this.capturar_error("+");
                return false;
            }
        }
        if (lista_token[index].id_token == 41) { //cerrar parentesis
            texto_py = texto_py + ")";
            this.consumir();
        }
        else {
            this.capturar_error(")");
            return false;
        }
        if (lista_token[index].id_token == 59) { //punto y coma
            this.consumir();
        }
        else {
            this.capturar_error(";");
            return false;
        }
        return true;
    };
    // ###################### SENTENCIA IF-ELSE-ELSEIF  ###########################
    Sintact.prototype.sentencia_if = function (tab, elif) {
        if (lista_token[index].id_token == 809) { // if
            if (elif == 1) {
                texto_py = texto_py + "\n" + tab + "elif ";
            }
            else {
                texto_py = texto_py + "\n" + tab + lista_token[index].lexema;
            }
            this.consumir();
        }
        else {
            this.capturar_error("if");
            return false;
        }
        if (lista_token[index].id_token == 40) { // abrir parentesis
            this.consumir();
        }
        else {
            this.capturar_error("(");
            return false;
        }
        while (lista_token[index].id_token != 41) { // != cerrar parentesis
            //o
            var val = this.validacion_logica();
            if (!val) {
                return false;
            }
        }
        if (lista_token[index].id_token = 41) { // cerrar parentesis
            this.consumir();
        }
        else {
            this.capturar_error(")");
            return false;
        }
        if (lista_token[index].id_token == 123) { // abrir llaves
            texto_py = texto_py + " :";
            this.consumir();
        }
        else {
            this.capturar_error("{");
            return false;
        }
        while (lista_token[index].id_token != 125) { // sentencias 
            // sentencias
            var val = this.sentencias(59, 125, tab + "\t");
            if (!val) {
                return false;
            }
            if (index >= lista_token.length) {
                return false;
            }
            //sentencias
        }
        if (lista_token[index].id_token == 125) { // cerrar llave
            this.consumir();
        }
        else {
            this.capturar_error("}");
            return false;
        }
        try {
            if (lista_token[index].id_token == 810) { //else
                texto_py = texto_py + "\n" + tab + lista_token[index].lexema;
                this.consumir();
                if (lista_token[index].id_token == 123) {
                    texto_py = texto_py + " :";
                    this.consumir();
                    while (lista_token[index].id_token != 125) { // sentencias
                        //sentencias
                        var val = this.sentencias(59, 125, tab + "\t");
                        if (!val) {
                            return false;
                        }
                        if (index >= lista_token.length) {
                            return false;
                        }
                        //sentencias
                    }
                    if (lista_token[index].id_token == 125) { //cerrar llave
                        this.consumir();
                    }
                    else {
                        this.capturar_error("}");
                        return false;
                    }
                }
                else if (lista_token[index].id_token == 809) { /// else if
                    this.sentencia_if(tab, 1);
                }
                else {
                    this.capturar_error("If or {");
                    return false;
                }
            }
        }
        catch (error) { }
        return true;
    };
    // ###################### DECLARACION DE METODO O FUNCION  ###########################        *
    Sintact.prototype.declaracion_metodo = function (tab) {
        var func = false;
        var nombre_v = "";
        var tipo_v = "";
        var fila = 0;
        var is_main = 0;
        if (this.es_tipo_de_dato || lista_token[index].id_token == 805) { // if es tipo de dato o void
            if (lista_token[index].id_token == 805) {
                func = true;
            }
            this.consumir();
            texto_py = texto_py + "\n" + tab + "def";
        }
        else {
            this.capturar_error("Tipo de dato");
            return false;
        }
        if (this.es_identificador() || lista_token[index].id_token == 806) { // es identificador
            is_main = lista_token[index].id_token;
            texto_py = texto_py + " " + lista_token[index].lexema;
            this.consumir();
        }
        else {
            this.capturar_error("Id");
            return false;
        }
        if (lista_token[index].id_token == 40) { //abrir parentesis
            texto_py = texto_py + " " + lista_token[index].lexema;
            this.consumir();
        }
        else {
            this.capturar_error("(");
            return false;
        }
        while (lista_token[index].id_token != 41) { // distinto de cerrar parentesis
            if (this.es_tipo_de_dato()) { // es tipo de dato
                tipo_v = lista_token[index].lexema;
                this.consumir();
            }
            else {
                this.capturar_error("Tipo de dato");
                return false;
            }
            if (this.es_identificador()) { // es identicficador
                texto_py = texto_py + " " + lista_token[index].lexema;
                nombre_v = lista_token[index].lexema;
                fila = lista_token[index].fila;
                lista_variables.push(new Token(nombre_v, tipo_v, 0, fila, 0));
                this.consumir();
            }
            else {
                this.capturar_error("Id");
                return false;
            }
            if (lista_token[index].id_token == 44) { // si es coma
                texto_py = texto_py + " " + lista_token[index].lexema;
                this.consumir();
            }
            else if (lista_token[index].id_token != 41) { // si no es coma y tampoco cerrar paretentesis
                this.capturar_error(", o )");
                return false; //******* */
            }
        }
        if (lista_token[index].id_token == 41) { // es cerrar parentesis
            texto_py = texto_py + " " + lista_token[index].lexema;
            this.consumir();
        }
        else {
            this.capturar_error(")");
            return false;
        }
        if (lista_token[index].id_token == 123) { // es abrrir llave
            texto_py = texto_py + " :";
            this.consumir();
        }
        else {
            this.capturar_error("{");
            return false;
        }
        while (lista_token[index].id_token != 125) { // distinto de cerrar llave-> sentencias
            // sentencias
            var val = this.sentencias(59, 125, tab + "\t");
            if (!val) {
                return false;
            }
            if (index >= lista_token.length) {
                return false;
            }
        }
        if (is_main == 806) {
            texto_py = texto_py + "\n" + tab + "\tif__name__=\"__main__\":\n\t\t" + tab + "main()";
        }
        if (lista_token[index].id_token == 125) { //cerrar llave
            this.consumir();
        }
        else {
            this.capturar_error("}");
            return false;
        }
        return true;
    };
    // ###################### SENTENCIA DECLARACION DE VARIABLE  ###########################
    Sintact.prototype.declaracion_variable = function (tab) {
        var nombre_v = "";
        var tipo_v = "";
        var fila = 0;
        if (this.es_tipo_de_dato()) { // es tipo de dato
            tipo_v = lista_token[index].lexema;
            this.consumir();
        }
        else {
            this.capturar_error("Tipo de dato");
            return false;
        }
        texto_py = texto_py + "\n " + tab;
        while (lista_token[index].id_token != 59) { // mientras sea distinto de ;
            if (this.es_identificador()) { // es identificador
                nombre_v = lista_token[index].lexema;
                texto_py = texto_py + " " + nombre_v;
                fila = lista_token[index].fila;
                lista_variables.push(new Token(nombre_v, tipo_v, 0, fila, 0));
                this.consumir();
            }
            else {
                this.capturar_error("Id");
                return false;
            }
            if (lista_token[index].id_token == 61) { // if es igual
                texto_py = texto_py + " " + lista_token[index].lexema;
                this.consumir();
                while (lista_token[index].id_token != 59 && lista_token[index].id_token != 44) { // sea distintio de ; o de ,
                    if (this.es_valor()) { // es valor
                        texto_py = texto_py + " " + lista_token[index].lexema;
                        if (lista_token[index].id_token == 829) {
                            consola_html = consola_html + "\n" + lista_token[index].lexema;
                        }
                        this.consumir();
                    }
                    else {
                        this.capturar_error("Valor");
                        return false;
                    }
                    if (this.es_operador()) { // es operador
                        texto_py = texto_py + " " + lista_token[index].lexema;
                        this.consumir();
                    }
                    else if (lista_token[index].id_token != 59 && lista_token[index].id_token != 44) {
                        this.capturar_error("Operador");
                        return false;
                    }
                }
                if (lista_token[index].id_token == 44) {
                    texto_py = texto_py + "\n" + tab;
                    this.consumir();
                }
                else if (lista_token[index].id_token == 59) {
                    break;
                }
                else {
                    this.capturar_error(", o ;");
                    return false;
                }
            }
            else if (lista_token[index].id_token == 44) { // es coma                
                texto_py = texto_py + "=None" + "\n" + tab;
                this.consumir();
            }
            else {
                if (!this.es_identificador() && lista_token[index].id_token != 59) {
                    this.capturar_error("Id o ;");
                    return false;
                }
            }
        }
        if (lista_token[index].id_token == 59) {
            this.consumir();
        }
        else {
            this.capturar_error(";");
            return false;
        }
        return true;
    };
    Sintact.prototype.sentencia_variable_val = function (tab) {
        if (this.es_identificador()) {
            texto_py = texto_py + "\n" + tab + " " + lista_token[index].lexema;
            this.consumir();
        }
        else {
            this.capturar_error("Id");
            return false;
        }
        if (lista_token[index].id_token == 61) {
            texto_py = texto_py + " " + lista_token[index].lexema;
            this.consumir();
        }
        else {
            this.capturar_error("=");
            return true;
        }
        while (lista_token[index].id_token != 59) {
            if (this.es_valor()) { // es valor
                texto_py = texto_py + " " + lista_token[index].lexema;
                if (lista_token[index].id_token == 829) {
                    consola_html = consola_html + "\n" + lista_token[index].lexema;
                }
                this.consumir();
            }
            else {
                this.capturar_error("Valor");
                return false;
            }
            if (this.es_operador()) { // es operador
                texto_py = texto_py + " " + lista_token[index].lexema;
                this.consumir();
            }
            else if (lista_token[index].id_token != 59) {
                this.capturar_error("Operador");
                return false;
            }
        }
        if (lista_token[index].id_token == 59) {
            this.consumir();
        }
        else {
            this.capturar_error(";");
            return false;
        }
        return true;
    };
    // ###################### CAPTURAR ERROR SINTACTICO  ###########################    
    Sintact.prototype.capturar_error = function (tk) {
        var descripcion = "error sintactico, se esperaba: " + tk;
        var error = lista_token[index].lexema;
        var fila = lista_token[index].fila;
        var columna = lista_token[index].columna;
        lista_ES.push(new Token(error, descripcion, 999, fila, columna));
        this.consumir();
        esta_recuperado = false;
    };
    //##########################  VALIDACION LOGICA #############################
    Sintact.prototype.validacion_logica = function () {
        var unico = false;
        if (this.es_valor()) { // si es valor... id, num,cadena etc
            texto_py = texto_py + " " + lista_token[index].lexema;
            this.consumir();
            if (lista_token[index].id_token == 33) { // distinto de !=
                texto_py = texto_py + " " + lista_token[index].lexema;
                this.consumir();
                if (lista_token[index].id_token == 61) { // igua;        
                    texto_py = texto_py + lista_token[index].lexema;
                    this.consumir();
                }
                else {
                    this.capturar_error("!=");
                    return false;
                }
            }
            else if (lista_token[index].id_token == 60) { // menor , menor igual
                texto_py = texto_py + " " + lista_token[index].lexema;
                this.consumir();
                if (lista_token[index].id_token == 61) { //igual
                    texto_py = texto_py + lista_token[index].lexema;
                    this.consumir();
                }
            }
            else if (lista_token[index].id_token == 61) { //igual
                texto_py = texto_py + " " + lista_token[index].lexema;
                this.consumir();
                if (lista_token[index].id_token == 61) { //igual
                    texto_py = texto_py + lista_token[index].lexema;
                    this.consumir();
                }
            }
            else if (lista_token[index].id_token == 62) { // mayor mayor que
                texto_py = texto_py + " " + lista_token[index].lexema;
                this.consumir();
                if (lista_token[index].id_token == 61) { //igual
                    texto_py = texto_py + lista_token[index].lexema;
                    this.consumir();
                }
            }
            else {
                if (lista_token[index].id_token != 38 &&
                    lista_token[index].id_token != 124 &&
                    lista_token[index].id_token != 33 &&
                    lista_token[index].id_token != 41) {
                    this.capturar_error("Relacional");
                    return false;
                }
                else {
                    unico = true;
                }
            }
            if (!unico) {
                if (this.es_valor()) {
                    texto_py = texto_py + " " + lista_token[index].lexema;
                    this.consumir();
                }
                else {
                    this.capturar_error("Valor");
                    return false;
                }
            }
        }
        else if (lista_token[index].id_token == 33) { //distinto de
            texto_py = texto_py + " not";
            this.consumir();
            if (this.es_valor()) {
                texto_py = texto_py + " " + lista_token[index].lexema;
                this.consumir();
            }
            else {
                this.capturar_error("Id");
                return false;
            }
        }
        else {
            this.capturar_error("Id");
            return false;
        }
        if (lista_token[index].id_token == 38) { // AND
            this.consumir();
            if (lista_token[index].id_token == 38) {
                this.consumir();
                texto_py = texto_py + " and";
            }
            else {
                this.capturar_error("&&");
                return false;
            }
        }
        else if (lista_token[index].id_token == 124) { // OR
            this.consumir();
            if (lista_token[index].id_token == 124) {
                this.consumir();
                texto_py = texto_py + " or";
            }
            else {
                this.capturar_error("||");
                return false;
            }
        }
        else {
            if (lista_token[index].id_token != 33 && lista_token[index].id_token != 41) {
                this.capturar_error(") o !"); ///errrrrrrrrrrrrorrrrrrr
                return false;
            }
        }
        return true;
    };
    Sintact.prototype.es_tipo_de_dato = function () {
        return (lista_token[index].id_token > 799 && lista_token[index].id_token < 805);
    };
    Sintact.prototype.es_valor = function () {
        if (this.es_decimal() || this.es_entero() || this.es_cadena() || this.es_char() ||
            this.es_false() || this.es_true() || this.es_identificador() || this.es_texto_html()) {
            return true;
        }
        else {
            return false;
        }
    };
    Sintact.prototype.es_identificador = function () {
        return lista_token[index].id_token == 818;
    };
    Sintact.prototype.es_texto_html = function () {
        return lista_token[index].id_token == 829;
    };
    Sintact.prototype.es_cadena = function () {
        return lista_token[index].id_token == 822;
    };
    Sintact.prototype.es_entero = function () {
        return lista_token[index].id_token == 819;
    };
    Sintact.prototype.es_decimal = function () {
        return lista_token[index].id_token == 823;
    };
    Sintact.prototype.es_char = function () {
        return lista_token[index].id_token == 824;
    };
    Sintact.prototype.es_false = function () {
        return lista_token[index].id_token == 826;
    };
    Sintact.prototype.es_true = function () {
        return lista_token[index].id_token == 825;
    };
    Sintact.prototype.es_operador = function () {
        if (lista_token[index].id_token == 42 || lista_token[index].id_token == 43
            || lista_token[index].id_token == 45 || lista_token[index].id_token == 47) {
            return true;
        }
        else {
            return false;
        }
    };
    Sintact.prototype.consumir = function () {
        index++;
    };
    Sintact.prototype.crear_tablas = function (lista, nombre) {
        var table = "<table class=\"table table-hover\">\n";
        table = table + "<tr class=\"table-info\">";
        table = table + "\n<td>Nombre</td>";
        table = table + "\n<td>Tipo</td>";
        table = table + "\n<td>Fila</td>";
        table = table + "\n</tr>";
        lista.forEach(function (value) {
            table = table + "\n<tr class=\"table-active\">";
            table = table + "\n<td>" + value.lexema + "</td>";
            table = table + "\n<td>" + value.descripcion + "</td>";
            table = table + "\n<td>" + value.fila + "</td>";
            table = table + "\n</tr>";
        });
        table = table + "\n</table>";
        document.getElementById(nombre).innerHTML = table;
    };
    return Sintact;
}());
