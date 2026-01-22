"""
第三方平台集成 API 路由
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app import crud, schemas
from backend.app.database import SessionLocal

router = APIRouter(prefix="/api/integrations", tags=["integrations"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[schemas.ThirdPartyIntegration])
def list_integrations(db: Session = Depends(get_db)):
    """获取所有第三方集成"""
    return crud.list_integrations(db)


@router.get("/{platform}", response_model=schemas.ThirdPartyIntegration)
def get_integration_by_platform(platform: str, db: Session = Depends(get_db)):
    """获取指定平台的集成配置"""
    integration = crud.get_integration_by_platform(db, platform)
    if not integration:
        raise HTTPException(status_code=404, detail="集成配置不存在")
    return integration


@router.post("/", response_model=schemas.ThirdPartyIntegration)
def create_integration(payload: schemas.ThirdPartyIntegrationCreate, db: Session = Depends(get_db)):
    """创建第三方集成"""
    # 检查是否已存在
    existing = crud.get_integration_by_platform(db, payload.platform)
    if existing:
        raise HTTPException(status_code=400, detail="该平台集成已存在")

    if payload.platform not in ['jd', 'eleme', 'meituan']:
        raise HTTPException(status_code=400, detail="不支持的平台")

    return crud.create_integration(db, payload.model_dump())


@router.put("/{integration_id}", response_model=schemas.ThirdPartyIntegration)
def update_integration(integration_id: str, payload: schemas.ThirdPartyIntegrationUpdate, db: Session = Depends(get_db)):
    """更新第三方集成配置"""
    result = crud.update_integration(db, integration_id, payload.model_dump(exclude_none=True))
    if not result:
        raise HTTPException(status_code=404, detail="集成配置不存在")
    return result


@router.delete("/{integration_id}")
def delete_integration(integration_id: str, db: Session = Depends(get_db)):
    """删除第三方集成"""
    success = crud.delete_integration(db, integration_id)
    if not success:
        raise HTTPException(status_code=404, detail="集成配置不存在")
    return {"ok": True}


@router.post("/{platform}/connect")
def connect_integration(platform: str, db: Session = Depends(get_db)):
    """连接第三方平台（模拟）"""
    integration = crud.get_integration_by_platform(db, platform)
    if not integration:
        raise HTTPException(status_code=404, detail="集成配置不存在")

    if not integration.appKey or not integration.appSecret:
        raise HTTPException(status_code=400, detail="请先配置AppKey和AppSecret")

    # 模拟连接成功
    from datetime import datetime
    crud.update_integration(db, integration.id, {
        "status": "connected",
        "lastSyncAt": datetime.utcnow().isoformat(),
        "errorMessage": None
    })

    return {"ok": True, "message": f"已成功连接到{platform}平台"}


@router.post("/{platform}/disconnect")
def disconnect_integration(platform: str, db: Session = Depends(get_db)):
    """断开第三方平台连接"""
    integration = crud.get_integration_by_platform(db, platform)
    if not integration:
        raise HTTPException(status_code=404, detail="集成配置不存在")

    crud.update_integration(db, integration.id, {
        "status": "disconnected",
        "accessToken": None,
        "refreshToken": None,
        "tokenExpiry": None
    })

    return {"ok": True, "message": f"已断开与{platform}平台的连接"}


@router.post("/{platform}/sync")
def sync_integration(platform: str, sync_type: str = "all", db: Session = Depends(get_db)):
    """同步数据（模拟）"""
    integration = crud.get_integration_by_platform(db, platform)
    if not integration:
        raise HTTPException(status_code=404, detail="集成配置不存在")

    if integration.status != "connected":
        raise HTTPException(status_code=400, detail="平台未连接")

    # 模拟同步
    from datetime import datetime
    crud.update_integration(db, integration.id, {
        "lastSyncAt": datetime.utcnow().isoformat()
    })

    return {
        "ok": True,
        "message": f"已同步{platform}平台数据",
        "syncType": sync_type,
        "syncedAt": datetime.utcnow().isoformat()
    }
