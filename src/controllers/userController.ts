import { NextFunction } from "express";
import express from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import randomstring from "randomstring";
import jwt from "jsonwebtoken";

const UserController = {
    createSuperUser: async (
        req: express.Request,
        res: express.Response,
        next: NextFunction
    ) => {
        const { firstName, lastName, nationalCode, mobile, password } =
            req.body;

        const userByNationalCode = await User.findOne({
            isDeleted: false,
            nationalCode: nationalCode,
        });
        if (userByNationalCode) {
            return res.status(400).json({
                message: "کاربر با این مشخصات قبلا در سامانه ثبت نام کرده است",
            });
        }

        const userByMobile = await User.findOne({
            isDeleted: false,
            mobile: mobile,
        });
        if (userByMobile) {
            return res.status(400).json({
                message: "کاربر با این مشخصات قبلا در سامانه ثبت نام کرده است",
            });
        }

        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            nationalCode: nationalCode,
            mobile: mobile,
            password: hashPassword,
            isAdmin: true,
            isStaff: true,
        });

        await newUser.save();
        return res.status(201).json({
            message: "کاربر با موفقیت ایجاد شد",
            data: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                nationalCode: newUser.nationalCode,
            },
        });
    },

    createUser: async (
        req: express.Request,
        res: express.Response,
        next: NextFunction
    ) => {
        const { firstName, lastName, nationalCode, mobile, password } =
            req.body;

        const userByNationalCode = await User.findOne({
            isDeleted: false,
            nationalCode: nationalCode,
        });
        if (userByNationalCode) {
            return res.status(400).json({
                message: "کاربر با این مشخصات قبلا در سامانه ثبت نام کرده است",
            });
        }

        const userByMobile = await User.findOne({
            isDeleted: false,
            mobile: mobile,
        });
        if (userByMobile) {
            return res.status(400).json({
                message: "کاربر با این مشخصات قبلا در سامانه ثبت نام کرده است",
            });
        }

        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            nationalCode: nationalCode,
            password: hashPassword,
            mobile: mobile,
            isAdmin: false,
            isStaff: false,
        });

        await newUser.save();
        return res.status(201).json({
            message: "کاربر با موفقیت ایجاد شد",
            data: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                nationalCode: newUser.nationalCode,
            },
        });
    },

    verifyUser: async (
        req: express.Request,
        res: express.Response,
        next: NextFunction
    ) => {
        try {
            const { mobile, password } = req.body;

            const user = await User.findOne({
                isDeleted: false,
                mobile: mobile,
            });
            if (!user) {
                return res.status(400).json({
                    message: "کاربری با این مشخصات در سامانه ثبت نشده است",
                });
            }

            let isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: "کلمه عبور صحیح نمی باشد",
                });
            }

            await User.updateOne({
                activationCode: randomstring.generate({
                    length: 6,
                    charset: "numeric",
                }),
                updatedAt: Date.now(),
            });

            return res.status(200).json({
                message: "کد فعالسازی به شماره همراه شما ارسال شد",
            });
        } catch (error) {
            console.log(error);
        }
    },

    loginUser: async (
        req: express.Request,
        res: express.Response,
        next: NextFunction
    ) => {
        const { mobile, activationCode } = req.body;

        const user = await User.findOne({ isDeleted: false, mobile: mobile });
        if (activationCode != user?.activationCode) {
            return res.status(200).json({
                message: "کد اعتبار سنجی نامعتبر می باشد",
            });
        }

        const payload = {
            id: user?._id,
            firstName: user?.firstName,
            lastName: user?.lastName,
        }; // Creating jwt payload
        // Sign Token
        jwt.sign(
            payload,
            `${process.env.SECRET_KEY}`,
            { expiresIn: "7d" },
            (err, token) => {
                res.json({
                    success: true,
                    token: "Bearer " + token,
                });
            }
        );
    },

    listOfUser: async (
        req: express.Request,
        res: express.Response,
        next: NextFunction
    ) => {
        const users = await User.find({ isDeleted: false });
        return res.status(200).json(users);
    },

    getUserById: async (
        req: express.Request,
        res: express.Response,
        next: NextFunction
    ) => {
        const { id } = req.params;
        const user = await User.findOne({ isDeleted: false, _id: id });
        console.log(user)
        return res.status(200).json({
            firstName: user?.firstName,
            lastName: user?.lastName,
            nationalCode: user?.nationalCode,
            mobile: user?.mobile,
        });
    },
};
export default UserController;
