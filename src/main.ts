import {App, Modal, Notice, Plugin, Setting, TextComponent} from 'obsidian';
import {DEFAULT_SETTINGS, MyPluginSettings, SampleSettingTab} from "./settings";
import { VideoMetadata } from 'types/metadata';
import { getYoutubeId } from './utils/helpers';
import play from 'play-dl';

export class VideoInfo {
	private _videoUrl = '';
	
	// Setter
	set setVideoUrl(videoUrl: string) {
		this._videoUrl = videoUrl;
	} 
	// Getter
	get getVideoUrl(): string {
		return this._videoUrl;
	}

	async fetchVideoInfo(): Promise<VideoMetadata> {
		try {
			const videoInfo = await play.video_info(this._videoUrl);
			const videoDetails = videoInfo.video_details;
			const videoID = getYoutubeId(this._videoUrl) || '';
			const thumbnails = `https://img.youtube.com/vi/${videoID}/hqdefault.jpg` || `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;

			const metadata: VideoMetadata = {
				title: videoDetails.title || "Untitled",
				length: videoDetails.durationRaw,
				author: videoDetails.channel?.name || "Unknown",
				channelUrl: videoDetails.channel?.url || '',
				uploadDate: videoDetails.uploadedAt || '',
				thumbnail: thumbnails,		
				videoUrl: this.getVideoUrl				
			}
			return metadata

		} catch (error) {
			console.error('Error fetching video info:', error);
			throw new Error('Failed to fetch video information');
		}
	}
}

export default class Main extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		// This creates an icon in the left ribbon.
		this.addRibbonIcon('video', 'Video properties', async (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new YoutubeModal(this.app, this).open();
		});
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {
	}
	async createNote(metadata: VideoMetadata) {
        const safeTitle = metadata.title.replace(/[\\/:*?"<>|]/g, '-');
        const fileName = `${safeTitle}.md`;
        
        const fileContent = 
		`---\ntitle: "${metadata.title}"\nlength: "${metadata.length}"\nauthor: "${metadata.author}"\nchannelUrl: "${metadata.channelUrl || ''}"\nuploadDate: "${metadata.uploadDate}"\nthumbnail: "${metadata.thumbnail}"\nvideoUrl: "${metadata.videoUrl}"\n---`
		try {
            const newFile = await this.app.vault.create(fileName, fileContent);
            
            this.app.workspace.getLeaf(false).openFile(newFile);
            new Notice(`Note created: ${safeTitle}`);

        } catch (error) {
            new Notice(`Error: A note named "${safeTitle}" already exists.`);
        }
    }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MyPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class YoutubeModal extends Modal {
    plugin: Main;
    urlInput: string = '';

    constructor(app: App, plugin: Main) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: 'Create Note from YouTube URL' });

        // Usamos la clase Setting de Obsidian para una UI nativa y limpia
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
						btn.setButtonText('Create note').setDisabled(false);
					}
				}));
	}

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}