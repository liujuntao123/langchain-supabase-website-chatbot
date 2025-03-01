import type { CheerioAPI, load as LoadT } from 'cheerio';
import { Document } from 'langchain/document';
import { BaseDocumentLoader } from 'langchain/document_loaders';
import type { DocumentLoader } from 'langchain/document_loaders';
import { CheerioWebBaseLoader } from 'langchain/document_loaders';

export class CustomWebLoader
  extends BaseDocumentLoader
  implements DocumentLoader
{
  constructor(public webPath: string) {
    super();
  }

  static async _scrape(url: string): Promise<CheerioAPI> {
    const { load } = await CustomWebLoader.imports();
    console.log('fetch url',url)
    const response = await fetch(url);
    console.log('fetch success')
    const html = await response.text();
    // console.log('html',html)
    return load(html);
  }

  async scrape(): Promise<CheerioAPI> {
    return CustomWebLoader._scrape(this.webPath);
  }

  async load(): Promise<Document[]> {
    const $ = await this.scrape();
    const title = $('.content h1').text();
    console.log('title',title)
    // const date = $('meta[property="article:published_time"]').attr('content');
    const date=''

    const content = $('.vt-doc')
      .clone()
      .find('div.elementor, style')
      .remove()
      .end()
      .text();
      
      // console.log('content',content)

    const cleanedContent = content.replace(/\s+/g, ' ').trim();

    const contentLength = cleanedContent?.match(/\b\w+\b/g)?.length ?? 0;

    const metadata = { source: this.webPath, title, date, contentLength };

    return [new Document({ pageContent: cleanedContent, metadata })];
  }

  static async imports(): Promise<{
    load: typeof LoadT;
  }> {
    try {
      const { load } = await import('cheerio');
      return { load };
    } catch (e) {
      console.error(e);
      throw new Error(
        'Please install cheerio as a dependency with, e.g. `yarn add cheerio`',
      );
    }
  }
}
