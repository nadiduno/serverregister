import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import { z } from 'zod'

const app = fastify()

const prisma = new PrismaClient()

interface UserParams {
  name: string;
  lastName: string; 
  email: string;
  cpf: string;
  birthDate: string;
  phoneNumber: string;
  volunteerType: string;
  crm: string;
  area: string;
  state: string;
  availability: string;
  notes?: string | null;
}

//READ
app.get('/users', async () => {
  try {
    const users = await prisma.user.findMany();
    return { users };
  } catch (error) {
    console.error('Error when searching for users: ', error);
    return { message: 'Internal server error' };
  }
});


//CREATE
app.post('/users', async (request, reply) => {
  const createUserSchema = z.object({
    name: z.string(),
    lastName: z.string(), 
    email: z.string().email(),
    cpf: z.string(),
    birthDate: z.string(),
    phoneNumber: z.string(),
    volunteerType: z.string(),
    crm: z.string(),
    area: z.string(),
    state: z.string(),
    availability: z.string(),
    notes: z.string().nullable(),
  });

  try {
    const { name, lastName, email, cpf, birthDate, phoneNumber, volunteerType, crm, area, state, availability, notes } =
      createUserSchema.parse(request.body);

    await prisma.user.create({
      data: {
        name,
        lastName, 
        email,
        cpf,
        birthDate,
        phoneNumber,
        volunteerType,
        crm,
        area,
        state,
        availability,
        notes,
      },
    });

    return reply.status(201).send();
  } catch (error) {
    console.error('Erro ao criar usuário: ', error);
    return reply.status(500).send({ message: error });
  }
});

//UPDATE
app.put('/users/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const {
    name,
    lastName,
    email,
    cpf,
    birthDate,
    phoneNumber,
    volunteerType,
    crm,
    area,
    state,
    availability,
    notes,
  } = request.body as UserParams;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!existingUser) {
      return reply.status(404).send({ message: 'Usuário não encontrado' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        name,
        lastName,
        email,
        cpf,
        birthDate,
        phoneNumber,
        volunteerType,
        crm,
        area,
        state,
        availability,
        notes,
      },
    });

    return reply.status(200).send(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário: ', error);
    return reply.status(500).send({ message: 'Erro interno do servidor' });
  }
});

//DELETE
app.delete('/users/:id', async (request, reply) => {
  const { id } = request.params as { id: string };

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!existingUser) {
      return reply.status(404).send({ message: 'User not found' });
    }

    const deletedUser = await prisma.user.delete({
      where: { id: id },
    });

    return reply.status(200).send(deletedUser);
  } catch (error) {
    console.error('Error when deleting user: ', error);
    return reply.status(500).send({ message: error });
  }
});


//SERVER
app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
  console.log('HTTP Server Running')
})