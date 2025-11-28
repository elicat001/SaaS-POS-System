"""
AI代理路由 - 将AI调用移到后端，保护API密钥安全
"""

import os
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/ai", tags=["ai"])

# 从环境变量获取API密钥
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

# 延迟导入Google GenAI
genai_client = None


def get_genai_client():
    """获取或创建GenAI客户端"""
    global genai_client
    if genai_client is None and GEMINI_API_KEY:
        try:
            from google import genai
            genai_client = genai.Client(api_key=GEMINI_API_KEY)
        except ImportError:
            pass
    return genai_client


# ==================== 请求模型 ====================

class InsightRequest(BaseModel):
    salesData: dict
    recentOrders: list


class ProductDescriptionRequest(BaseModel):
    productName: str


class InsightResponse(BaseModel):
    insight: str


class DescriptionResponse(BaseModel):
    description: str


# ==================== API端点 ====================

@router.post("/insight", response_model=InsightResponse)
async def generate_insight(request: InsightRequest):
    """生成业务洞察"""
    if not GEMINI_API_KEY:
        return InsightResponse(insight="AI服务未配置。请联系管理员设置API密钥。")

    client = get_genai_client()
    if not client:
        return InsightResponse(insight="AI服务暂不可用。")

    try:
        prompt = f"""
        Act as a senior business analyst for a restaurant using a SaaS system like KeRuYun.
        Analyze the following sales data and recent orders.
        Provide a concise, bulleted list of 3 strategic insights and 1 marketing recommendation to improve revenue.
        Keep the tone professional and encouraging.
        Please respond in Chinese.

        Data:
        {request.salesData}

        Recent Orders Sample:
        {request.recentOrders[:5] if request.recentOrders else []}
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )

        return InsightResponse(
            insight=response.text if response.text else "无法生成洞察，请稍后重试。"
        )

    except Exception as e:
        print(f"AI insight error: {e}")
        return InsightResponse(insight="生成洞察时出错，请稍后重试。")


@router.post("/product-description", response_model=DescriptionResponse)
async def generate_product_description(request: ProductDescriptionRequest):
    """生成商品描述"""
    if not GEMINI_API_KEY:
        return DescriptionResponse(description="美味可口，值得品尝。")

    client = get_genai_client()
    if not client:
        return DescriptionResponse(description="精心制作，口感绝佳。")

    try:
        prompt = f"""
        Write a short, mouth-watering menu description (max 20 words) for a dish named: "{request.productName}".
        Please respond in Chinese.
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )

        return DescriptionResponse(
            description=response.text if response.text else "美味佳肴，不容错过。"
        )

    except Exception:
        return DescriptionResponse(description="精选食材，匠心制作。")


@router.get("/status")
async def get_ai_status():
    """检查AI服务状态"""
    return {
        "available": bool(GEMINI_API_KEY),
        "provider": "Google Gemini" if GEMINI_API_KEY else None
    }
