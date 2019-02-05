const mongoose   = require('mongoose'),
      Schema     = mongoose.Schema,
      bcrypt     = require('bcrypt'); 
uniqueValidator  = require('mongoose-unique-validator');

 // define user Schema
 var UsuarioSchema = new Schema({
    // nome: {
    //     type: String, 
    //     required: [true, "Nome do usuário é requerido"],
    //     minlength: 2 
    // },
    // sobrenome: {
    //     type: String, 
    //     required: [true, "Sobrenome do usuário é requerido"],
    //     minlength: 2 
    // },
    // funcao: {
    //     type: String, 
    //     required: [true, "Função do usuário é requerida"],
    //     minlength: 4  
    // },
    // custoHora: {
    //     type: Number, 
    //     required: [true, "Custo/hora do usuário é requerido"],
    //     min: 10 
    // },
    email: {
        type: String, 
        trim: true,
        lowercase: true,
        unique: true,
        required: [true,'Email é requerido'],
        validate: {
          validator: function( value ) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( value );
          },
          message: "Por favor, utilize um endereço de e-mail válido",
        },
    },
    senha: {
        type: String, 
        // default: "torrenegra123",
        minlength: 8,
        maxlength: 256,
        },
    // admin: {
    //     type: Boolean,
    //     default: false
    // },
    // ativo: {
    //     type: Boolean,
    //     default: true
    // },
    }, { timestamps: true },
       { autoIndex: false }
);

UsuarioSchema.pre('save', function(next) {
    var user  =  this;

    if (!user.isModified('senha')) return next();

    bcrypt.genSalt(10, (err, salt ) => {
        if (err) return next(err);

        bcrypt.hash(user.senha, salt, (err, hash) => {
            if (err) return next(err);

            user.senha = hash;
            next();
        })
    })
})

UsuarioSchema.methods.comparePassword = function (userPassword, cb) {

    bcrypt.compare(userPassword, this.senha, (err, isMatch) => {

        if (err) return cb(err);

        cb(null, isMatch);
    })
}

UsuarioSchema.plugin(uniqueValidator, {message: 'E-mail já cadastrado.'});
// stored model in variable
const Usuario = mongoose.model('Usuario', UsuarioSchema);
// set model by passing his Schema
module.exports = Usuario;



