import { RefObject } from 'react';
import { DOWNLOAD_CONFIG } from './constants';

/**
 * Downloads the timetable as a JPEG image
 * @param timetableRef - React ref to the timetable container
 */
export const downloadAsImage = async (timetableRef: RefObject<HTMLDivElement>) => {
    if (!timetableRef.current) return;

    const tableElement = timetableRef.current.querySelector('table');
    if (!tableElement) return;

    try {
      // @ts-ignore
      const { toJpeg } = await import('html-to-image');

      // Clone the table into an off-screen container so it renders at full width
      const tempWrapper = document.createElement('div');
      tempWrapper.style.position = 'absolute';
      tempWrapper.style.left = '-9999px';
      tempWrapper.style.top = '0';
      tempWrapper.style.backgroundColor = DOWNLOAD_CONFIG.image.backgroundColor;

      const clonedTable = tableElement.cloneNode(true) as HTMLElement;
      tempWrapper.appendChild(clonedTable);
      document.body.appendChild(tempWrapper);

      // Wait a tick so the browser can lay out the clone
      await new Promise((r) => requestAnimationFrame(r));

      const width = clonedTable.scrollWidth;
      const height = clonedTable.scrollHeight;

      const dataUrl = await toJpeg(clonedTable, {
        pixelRatio: DOWNLOAD_CONFIG.image.pixelRatio,
        quality: DOWNLOAD_CONFIG.image.quality,
        width,
        height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
        },
      });

      const link = document.createElement('a');
      link.download = `timetable-${new Date().toISOString().split('T')[0]}.jpg`;
      link.href = dataUrl;
      link.click();

      // Clean up
      document.body.removeChild(tempWrapper);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };