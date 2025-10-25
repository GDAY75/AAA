module VideoHelper
  def local_video_tag(video, autoplay: false)
    poster_path =
      if video.poster.present?
        asset_path(video.poster)
      end

    content_tag(:div, class: "embed-16by9") do
      video_tag(
        asset_path(video.file),
        controls: true,
        preload: "metadata",
        poster: poster_path,
        playsinline: true,
        autoplay: autoplay,
        muted: autoplay,              # utile si autoplay
        class: "video-player"
      )
    end
  end
end
