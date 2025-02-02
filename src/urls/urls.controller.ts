import {
  Controller, Get, Post, Param, Body, Patch, Delete, Req, Res, UseGuards, HttpStatus
} from '@nestjs/common';
import { Response } from 'express';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('urls')
export class UrlsController {
  private readonly HOST = process.env.HOST || 'http://localhost';
  private readonly PORT = process.env.PORT || '4000';

  constructor(private readonly urlService: UrlsService) { }

  @UseGuards(JwtAuthGuard)
  @Post('shorten')
  async shortenUrl(@Req() req, @Body() createUrlDto: CreateUrlDto, @Res() res: Response) {
    if (!createUrlDto.originalUrl) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'originalUrl is a required value' });
    }

    const userId = req.user ? req.user.id : undefined;
    try {
      const urlModel = await this.urlService.createShortUrl({ ...createUrlDto, userId });
      return res.json({ shortUrl: `${this.HOST}:${this.PORT}/urls/${urlModel.shortUrl}` });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to shorten URL' });
    }
  }

  @Get(':shortUrl')
  async redirectUrl(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    try {
      const originalUrl = await this.urlService.getOriginalUrl(shortUrl);
      if (originalUrl) {
        return res.redirect(originalUrl);
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({ error: 'URL not found' });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve URL' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async listByUserId(@Req() req, @Res() res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'invalid user' });
    }

    try {
      const urls = await this.urlService.listByUserId(userId);
      return res.status(HttpStatus.OK).json({ message: "success", urls });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Req() req, @Param('id') id: number, @Res() res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'invalid user' });
    }

    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'invalid id' });
    }

    try {
      const url = await this.urlService.getById(id);
      if (!url?.isActive) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'invalid url' });
      }

      if (userId !== url.userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'url from another owner' });
      }

      return res.status(HttpStatus.OK).json({ message: "success", url });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async edit(@Req() req, @Param('id') id: number, @Body('originalUrl') newOriginalUrl: string, @Res() res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'invalid user' });
    }

    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'invalid id' });
    }

    if (!newOriginalUrl) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'invalid body' });
    }

    try {
      const found = await this.urlService.getById(id);
      if (!found?.isActive) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'invalid url' });
      }

      if (userId !== found.userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'url from another owner' });
      }

      const url = await this.urlService.updateOriginalUrl(id, newOriginalUrl);
      return res.status(HttpStatus.OK).json({ message: "success", url });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deactivateUrl(@Req() req, @Param('id') id: number, @Res() res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'invalid user' });
    }

    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'invalid id' });
    }

    try {
      const found = await this.urlService.getById(id);
      if (!found?.isActive) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'invalid url' });
      }

      if (userId !== found.userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'url from another owner' });
      }

      const success = await this.urlService.deactivateUrl(id);
      if (success) {
        return res.status(HttpStatus.OK).json({ message: "deleted" });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
