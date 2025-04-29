import { responseHandler } from "../utils/responseHandler.js";

export class BaseController {
  constructor(model) {
    this.model = model;
  }

  async getAll(req, res) {
    try {
      const items = await this.model.find();
      return responseHandler.success(res, items);
    } catch (error) {
      return responseHandler.error(
        res,
        `Failed to fetch ${this.model.modelName.toLowerCase()}s`,
      );
    }
  }

  async getById(req, res) {
    try {
      const item = await this.model.findById(req.params.id);
      if (!item) {
        return responseHandler.notFound(res);
      }
      return responseHandler.success(res, item);
    } catch (error) {
      return responseHandler.error(
        res,
        `Failed to fetch ${this.model.modelName.toLowerCase()}`,
      );
    }
  }

  async create(req, res) {
    try {
      const item = new this.model(req.body);
      await item.save();
      return responseHandler.success(res, item, 201);
    } catch (error) {
      return responseHandler.error(
        res,
        `Failed to create ${this.model.modelName.toLowerCase()}`,
      );
    }
  }

  async update(req, res) {
    try {
      const item = await this.model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) {
        return responseHandler.notFound(res);
      }
      return responseHandler.success(res, item);
    } catch (error) {
      return responseHandler.error(
        res,
        `Failed to update ${this.model.modelName.toLowerCase()}`,
      );
    }
  }

  async delete(req, res) {
    try {
      const item = await this.model.findByIdAndDelete(req.params.id);
      if (!item) {
        return responseHandler.notFound(res);
      }
      return responseHandler.success(res, {
        message: `${this.model.modelName} deleted successfully`,
      });
    } catch (error) {
      return responseHandler.error(
        res,
        `Failed to delete ${this.model.modelName.toLowerCase()}`,
      );
    }
  }
}
