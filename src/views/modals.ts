import {App, Modal, Notice, Setting, TextComponent} from 'obsidian';
import { VideoInfo} from 'main';
import Main from 'main';

export class YoutubePropertiesModal extends Modal {
    plugin: Main;
    urlInput: string = '';

    constructor(app: App, plugin: Main) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: 'Create note from YouTube URL' });

        // 'new Setting' for UI 
        new Setting(contentEl)
            .setName('Video URL')
            .setDesc('Paste the YouTube video URL here.')
			.addText((text: TextComponent) => {
				text.setPlaceholder('https://www.youtube.com/watch?v=example')
				.onChange((value) => {
					this.urlInput = value;
				});
			})
		
		new Setting(contentEl)
			.addButton((btn) => btn
				.setButtonText('Create note')
				.setCta()
				.onClick(async () => {
					if (!this.urlInput) {
						new Notice('Please enter a YouTube URL.');
						return;
					}
					
					btn.setButtonText('Creating...').setDisabled(true);	

					try {
						const videoInfo = new VideoInfo();
						videoInfo.setVideoUrl = this.urlInput;
						const metadata = await videoInfo.fetchVideoInfo();
						await this.plugin.createNote(metadata);
						this.close();
					} catch (error) {
						new Notice('Error fetching video information. Please check the URL and try again.');
						console.error(error);
						btn.setButtonText('Create note').setDisabled(false);
					}
				}));
	}

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}