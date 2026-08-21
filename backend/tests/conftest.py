"""测试公共配置：确保 backend 目录可导入 app 包。"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

