import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Url } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url.dto';
// import { UpdateUrlDto } from './dto/update-url.dto';

@Injectable()
export class UrlsService {
  constructor(
    @InjectModel(Url)
    private readonly urlModel: typeof Url,
  ) { }

  async createShortUrl(createUrlDto: CreateUrlDto): Promise<Url> {
    return this.urlModel.create(createUrlDto as any);
  }

  async getOriginalUrl(shortUrl: string): Promise<string | null> {
    const urlRecord = await this.urlModel.findOne({ where: { shortUrl } });

    if (urlRecord && urlRecord.isActive) {
      urlRecord.accessCount += 1;
      await urlRecord.save();
      return urlRecord.originalUrl;
    }
    return null;
  }

  async listByUserId(userId: string): Promise<{ rows: Url[]; count: number }> {
    return this.urlModel.findAndCountAll({ where: { userId } });
  }

  async getById(id: number): Promise<Url | null> {
    return this.urlModel.findByPk(id);
  }

  async updateOriginalUrl(id: number, originalUrl: string): Promise<Url | null> {
    const url = await this.urlModel.findByPk(id);
    if (url) {
      url.originalUrl = originalUrl;
      await url.save();
    }
    return url;
  }

  async deactivateUrl(id: number): Promise<boolean> {
    const urlRecord = await this.urlModel.findByPk(id);
    if (urlRecord) {
      urlRecord.isActive = false;
      await urlRecord.save();
      await urlRecord.destroy();
      return true;
    }
    return false;
  }
}
