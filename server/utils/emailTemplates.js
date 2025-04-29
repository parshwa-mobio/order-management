import fs from "fs/promises";
import path from "path";
import Handlebars from "handlebars";
import { logger } from "./logger.js";

class EmailTemplateManager {
  async getTemplate(templateName, data) {
    try {
      const templatePath = path.join(
        process.cwd(),
        "templates",
        `${templateName}.html`,
      );
      const template = await fs.readFile(templatePath, "utf8");
      const compiled = Handlebars.compile(template);

      return {
        html: compiled(data),
        text: this.stripHtml(compiled(data)),
      };
    } catch (error) {
      logger.error("Failed to load email template", error, { templateName });
      throw error;
    }
  }

  stripHtml(html) {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
}

export const emailTemplates = new EmailTemplateManager();
