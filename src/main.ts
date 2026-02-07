import { Notice, Plugin, normalizePath, TFolder } from 'obsidian';
import { DEFAULT_SETTINGS, YoutubePropertiesSettings, 
	YoutubePropertiesSettingTab } from "./settings";
import { VideoMetadata } from 'types/metadata';
import { getYoutubeId, formatDate } from './utils/helpers';
import { YoutubePropertiesModal } from './views/modals';
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
			const videoID = getYoutubeId(this._videoUrl);
			const thumbnails = `https://img.youtube.com/vi/${videoID}/hqdefault.jpg` || `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;

			const metadata: VideoMetadata = {
				title: videoDetails.title || "Untitled",
				length: videoDetails.durationRaw,
				author: videoDetails.channel?.name || "Unknown",
				channelUrl: videoDetails.channel?.url || '',
				uploadDate: formatDate(videoDetails.uploadedAt),
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
	settings: YoutubePropertiesSettings;

	async onload() {
		await this.loadSettings();
		// This creates an icon in the left ribbon.
		this.addRibbonIcon('video', 'Video properties', async (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new YoutubePropertiesModal(this.app, this).open();
		});
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new YoutubePropertiesSettingTab(this.app, this));
	}

	onunload() {
	}
	async createNote(metadata: VideoMetadata) {
        const safeTitle = metadata.title.replace(/[\\/:*?"<>|]/g, '-');
        const fileName = `${safeTitle}.md`;
		const folderPath = this.settings.folder || '';
		const fullPath = normalizePath(`${folderPath}/${fileName}`);
        
		if (folderPath !== "") {
        const folder = this.app.vault.getAbstractFileByPath(folderPath);
        
        if (!folder) {
            await this.app.vault.createFolder(folderPath);
            new Notice(`Folder "${folderPath}" does not exists. Folder created at specified path.`);
        } else if (!(folder instanceof TFolder)) {
            new Notice(`Error: "${folderPath}" exists but is not a folder.`);
            return;
        }
    }
        const fileContent = 
		`---\ntitle: "${metadata.title}"\nlength: "${metadata.length}"\nauthor: "${metadata.author}"\nchannelUrl: "${metadata.channelUrl || ''}"\nuploadDate: "${metadata.uploadDate}"\nthumbnail: "${metadata.thumbnail}"\nvideoUrl: "${metadata.videoUrl}"\n---\n`;
		try {
            const newFile = await this.app.vault.create(fullPath, fileContent);
            
            await this.app.workspace.getLeaf(false).openFile(newFile);
            new Notice(`Note created at: ${folderPath || "Root folder"}`);

        } catch (e) {
            new Notice(`Error: A note named "${safeTitle}" already exists.`);
			console.error(e);
        }
    }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<YoutubePropertiesSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


