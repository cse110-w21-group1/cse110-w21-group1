/**
 * @jest-environment puppeteer
 */

//import {router} from '../scripts/router';
//import {script} from '../scripts/script';

describe('Basic user flow for SPA ', () => {
    beforeAll(async () => {
      await page.goto('http://localhost:5500/source/index.html');
      await page.waitForTimeout(1000);
    });

    // Check if calendar button works
    it('Test1: Check Calendar Button', async () => {
        await page.click('img[id="calendar"]');
        expect(page.mainFrame().url()).toContain('#calendar');
    });

    // Check if new note appends new button to list
    it('Test2: Check New Note appends new note', async () => {
        await page.click('img[id="home"]');
        await page.click('button[class="newNotesButton"]');
        const newLength = (await page.$$('ul[id="noteslist"]')).length;
        expect(newLength).toEqual(1);
    });

});