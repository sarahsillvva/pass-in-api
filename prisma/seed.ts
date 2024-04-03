import { prisma } from '../src/lib/prisma'

async function seed() {
    await prisma.event.create({
        data:{
            id: 'f4ba3be5-1958-4c9a-9a5b-cb313f6f55a1',
            title: 'Seu primeiro programa em Node',
            slug: 'evento-node',
            details: 'Do zero ao primeiro projeto',
            maximumAttendees: 120,

        }
    })
}

seed().then(() =>{
    console.log('Database seeded!')  
    prisma.$disconnect()

})