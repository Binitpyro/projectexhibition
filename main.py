import os
import sys
import webview

def get_bundle_dir():
    # PyInstaller creates a temp folder and stores path in _MEIPASS
    if hasattr(sys, '_MEIPASS'):
        return sys._MEIPASS # type: ignore
    return os.path.abspath(".")

if __name__ == '__main__':
    # Get the path to the dist directory contents
    dist_dir = os.path.join(get_bundle_dir(), 'dist')
    index_html = os.path.join(dist_dir, 'index.html')

    # Create window pointing to local index.html
    webview.create_window(
        title='Project Exhibition',
        url=index_html,
        width=1280,
        height=720,
        min_size=(800, 600)
    )
    
    # Use AppData on Windows (or home directory on others) for persistent storage
    data_path = os.path.join(os.environ.get('APPDATA', os.path.expanduser('~')), 'ProjectExhibitionData')
    
    webview.start(http_server=True, private_mode=False, storage_path=data_path)
