import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = global.prisma;
}
async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    const userCount = await prisma.user.count();
    const videoCount = await prisma.video.count();
    console.log(`📊 Users: ${userCount}, Videos: ${videoCount}`);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
}

testConnection();

export default prisma;
