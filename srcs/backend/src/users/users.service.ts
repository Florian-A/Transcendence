import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, OnlineStatus, ReqState } from '@prisma/client'
import { UpdateUserDto } from './dto/UpdateUserDto';
import { UserDto } from 'src/dto/UserDto';
import { ProfileDto } from 'src/dto/ProfileDto';
import { authenticator } from 'otplib';

const user = Prisma.validator<Prisma.UserDefaultArgs>()({})
export type User = Prisma.UserGetPayload<typeof user>

const game = Prisma.validator<Prisma.GameDefaultArgs>()({})
export type Game = Prisma.GameGetPayload<typeof game>

const player = Prisma.validator<Prisma.PlayerDefaultArgs>()({})
export type Player = Prisma.PlayerGetPayload<typeof player>

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) { }

	private logger = new Logger('userService')

	async createUser(username: string, email: string, password: string) {
		return await this.prisma.user.create({
			data: {
				username,
				email,
				password
			},
		});
	}

	async getAllUsers(): Promise<UserDto[]> {
		const users = await this.prisma.user.findMany({
			select: {
				id: true,
				username: true,
				avatar: true,
				status: true,
			}
		});
		return users;
	}

	async updateUser(id: number, data: UpdateUserDto): Promise<boolean> {
		//only a-z, 0-9, '-', '_', case insensitive, empty string not allowed
		if (data.username || data.username === "") {
			let valid = data.username.match(/^[a-z0-9\-_]+$/i);
			let empty = data.username.match(/^(?!\s*$).+/i);
			if (!valid || empty == null) return (false)
		}
		try {
			await this.prisma.user.update({ where: { id }, data });
		} catch (err: any) {
			return (false);
		}
		return (true);
	}

	async updateNick(id: number, data: string): Promise<boolean> {
		// refuse if string contain sth other than alphabet, number and '-'
		return (true) 
	}

	async deleteUser(userId: number): Promise<boolean> {
		try {
			const user = await this.prisma.user.delete({
				where: { id: userId }
			})
		} catch (err: any) {
			return (false)
		}
		return (true);
	}

	//dont touch
	async getUserByEmail(email: string) {
		console.log('getUserByEmail', email);
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});
		return user;
	}

	async getIdByNick(nick: string) {
		const user = await this.prisma.user.findUnique({
			where: { username: nick	}
		});
		if (!user) return (null);
		return (user.id);
	}

	async getNickById(id: number) {
		const user = await this.prisma.user.findUnique({
			where: { id }
		});
		if (!user) return (null);
		return (user.username);
	}

	// async getUserBasic(id: number) {
	// 	return (
	// 		await this.prisma.user.findUnique({
	// 			where: { id },
	// 			select: {
	// 				id: true,
	// 				username: true,
	// 				avatar: true,
	// 				status: true,
	// 			}
	// 		})
	// 	)
	// }
	
	async getHalfProfile(id: number): Promise<ProfileDto | null>  {
		let profile = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				password: true,
				username: true,
				avatar: true,
				bio: true,
				status: true,
				activated2FA: true,
			}
		});
		if (!profile) {
			return (null);
		}
		if (profile && profile.password === "nopass") {
			profile = { ...profile, password: "nopass" };
		} else {
			profile = { ...profile, password: null };
		}
		return ({
			...profile,
			friend: null, block: null, blocked: null, sent: null,
			gameHistory: [], achieve: null
		})
	}

	async getUserById(id: number): Promise<UserDto> {
		return (
			await this.prisma.user.findUnique({
				where: { id },
				select: {
					id: true,
					username: true,
					avatar: true,
					status: true,
					activated2FA: true,
				}
			})
		)
	}

	// the freind, block, blocked should be given by other services
	// async getUserProfileById(id: number): Promise<ProfileDto | null> {
	// 	let profile = await this.prisma.user.findUnique({
	// 		where: { id },
	// 		select: {
	// 			id: true,
	// 			password: true,
	// 			username: true,
	// 			avatar: true,
	// 			bio: true,
	// 			status: true,
	// 			activated2FA: true,
	// 		}
	// 	});
	// 	if (profile && profile.password === "nopass") {
	// 		profile = { ...profile, password: "nopass" };
	// 	} else {
	// 		profile = { ...profile, password: null };
	// 	}
	// 	return ({
	// 		...profile,
	// 		friend: null, block: null, blocked: null, sent: null,
	// 		gameHistory: [], achieve: null
	// 	})
	// }

	// async getUserProfileByNick(nick: string): Promise<ProfileDto | null> {
	// 	let profile = await this.prisma.user.findUnique({
	// 		where: { username: nick },
	// 		select: {
	// 			id: true,
	// 			username: true,
	// 			avatar: true,
	// 			bio: true,
	// 			status: true,
	// 		}
	// 	});
	// 	return ({
	// 		...profile,
	// 		friend: null, block: null, blocked: null, sent: null,
	// 		gameHistory: [], achieve: null
	// 	})
	// }

	async getUserByNick(nick: string): Promise<UserDto> {
		return (
			await this.prisma.user.findUnique({
				where: { username: nick },
				select: {
					id: true,
					username: true,
					avatar: true,
					status: true,
				}
			})
		)
	}

	async generate2FASecret(user: User) {
		const secret = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri(user.email, process.env.APP_NAME, secret);
		return {
			secret,
			otpauthUrl
		}
	}

	async verify2FA(user: any, token: string) {
		user = await this.prisma.user.findUnique({
			where: { id: user.id }
		});
		console.log('user', user);
		console.log('token', token);
		console.log('otp', authenticator.verify({
			token: token,
			secret: user.otpHash
		}))
		return (authenticator.verify({
			token: token,
			secret: user.otpHash
		}));
	}

}
