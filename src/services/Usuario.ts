import mongoose from 'mongoose';
import Usuario, { IUsuarioModel, IUsuario } from '../models/Usuario';

const createUsuario = async (data: Partial<IUsuario>): Promise<IUsuarioModel> => {
    const usuario = new Usuario({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    return await usuario.save();
};

const getUsuario = async (usuarioId: string): Promise<IUsuarioModel | null> => {
    return await Usuario.findById(usuarioId).populate('organizacion');
};

const getAllUsuarios = async (): Promise<IUsuarioModel[]> => {
    return await Usuario.find().populate('organizacion');
};

const updateUsuario = async (usuarioId: string, data: Partial<IUsuario>): Promise<IUsuarioModel | null> => {
    const usuario = await Usuario.findById(usuarioId);
    if (usuario) {
        usuario.set(data);
        return await usuario.save();
    }
    return null;
};

const deleteUsuario = async (usuarioId: string): Promise<IUsuarioModel | null> => {
    return await Usuario.findByIdAndDelete(usuarioId);
};

const toggleUserRole = async (usuarioId: string, role: string): Promise<IUsuarioModel | null> => {
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
        return null;
    }

    const normalizedRole = role.trim().toLowerCase();
    if (!normalizedRole) {
        return null;
    }

    const roles = Array.isArray(usuario.roles) ? [...usuario.roles] : ['user'];
    const hasRole = roles.includes(normalizedRole);

    if (hasRole) {
        usuario.roles = roles.filter((existingRole) => existingRole !== normalizedRole);
        if (usuario.roles.length === 0) {
            usuario.roles = ['user'];
        }
    } else {
        usuario.roles = [...new Set([...roles, normalizedRole])];
    }

    return await usuario.save();
};

export default { createUsuario, getUsuario, getAllUsuarios, updateUsuario, deleteUsuario, toggleUserRole };