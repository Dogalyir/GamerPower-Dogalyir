import type { Component, IData, StatusEnum } from "./api-nequi.d";
import { ComponentStatusTranslations } from "./api-nequi.d";
import { db } from "./db";
import { NequiTable } from "./db/db-schemas";
import { eq } from "drizzle-orm";

const NEQUI_API_URL = "https://status.nequi.com.co/api/v2/summary.json";

async function sendTelegramMessage(
  chatId: string,
  message: string
): Promise<void> {
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    }
  );
}

function getComponentGroupName(
  component: Component,
  allComponents: Component[]
): string {
  if (!component.group_id) {
    return component.name;
  }

  const group = allComponents.find((c) => c.id === component.group_id);
  if (group) {
    return `${group.name} → ${component.name}`;
  }

  return component.name;
}

async function checkNequiStatus(chatId: string): Promise<void> {
  try {
    const response = await fetch(NEQUI_API_URL);
    const data = (await response.json()) as IData;

    for (const component of data.components) {
      // Skip group components (they don't have actual status)
      if (component.group) {
        continue;
      }

      const currentStatus: StatusEnum = component.status;
      const componentId = component.id;

      // Check if we have a previous status for this component
      const existingRecord = await db.query.NequiTable.findFirst({
        where: (t, o) => o.eq(t.id, componentId),
      });

      if (!existingRecord) {
        // First time tracking this component
        await db.insert(NequiTable).values({
          id: componentId,
          status: currentStatus,
        });
        console.log(`🆕 Nuevo componente rastreado: ${component.name}`);
        continue;
      }

      // Check if status changed
      if (existingRecord.status !== currentStatus) {
        const componentName = getComponentGroupName(
          component,
          data.components
        );
        const statusTranslation = ComponentStatusTranslations[currentStatus];
        const previousStatusTranslation =
          ComponentStatusTranslations[
            existingRecord.status as StatusEnum
          ];

        const message =
          `<b>🔔 Cambio de estado en Nequi</b>\n\n` +
          `<b>Componente:</b> ${componentName}\n` +
          `<b>Estado anterior:</b> ${previousStatusTranslation}\n` +
          `<b>Estado actual:</b> ${statusTranslation}\n\n` +
          `<i>Actualizado: ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}</i>`;

        await sendTelegramMessage(chatId, message);

        // Update the status in the database
        await db
          .update(NequiTable)
          .set({ status: currentStatus })
          .where(eq(NequiTable.id, componentId));

        console.log(
          `📢 Notificación enviada: ${componentName} - ${currentStatus}`
        );
      }
    }
  } catch (error) {
    console.error("❌ Error al verificar el estado de Nequi:", error);
  }
}

export async function startNequiMonitoring(chatId: string): Promise<void> {
  console.log("🚀 Iniciando monitoreo de Nequi...");

  // Initial check
  await checkNequiStatus(chatId);

  // Check every minute (60000ms)
  setInterval(() => checkNequiStatus(chatId), 60000);
}
