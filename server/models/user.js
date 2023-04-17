import { model, Schema } from "mongoose";
import { GENDERS } from "../constants.js";

const PreferenceSchema = new Schema({
    smoking: {
        type: Boolean,
        default: false,
    },
    drinking: {
        type: Boolean,
        default: false,
    },
    pets: {
        type: Boolean,
        default: false,
    },
    rent: {
        type: Object,
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 0,
        },
        exact: {
            type: Number,
            default: 0,
        },
        default: { min: 0, max: 0, exact: 0 },
    },
    age: {
        type: Object,
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 0,
        },
        default: { min: 0, max: 0 },
    },
    gender: {
        type: Array,
        validate: {
            validator: function (v) {
                return v.every((g) => Object.values(GENDERS).includes(g));
            },
            message: (props) => `${props.value} does not have valid genders!`,
        },
        required: true,
    },
});

const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        encryptedPassword: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            validate: {
                validator: function (v) {
                    return Object.values(GENDERS).includes(v);
                },
                message: (props) => `${props.value} is not a valid gender!`,
            },
            required: true,
        },
        location: {
            city: {
                type: String,
                required: true,
                trim: true,
            },
            state: {
                type: String,
                required: true,
                trim: true,
            },
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        preferences: {
            type: PreferenceSchema,
            required: true,
        },
    },
    {
        timestamps: true,
        methods: {
            async verifyPassword(password) {
                try {
                    return new PasswordService(password).verify(
                        this.encryptedPassword
                    );
                } catch (error) {
                    return false;
                }
            },
            fullName() {
                return `${this.firstName} ${this.lastName}`;
            },
        },
    }
);

const User = model("User", UserSchema);

export default User;
