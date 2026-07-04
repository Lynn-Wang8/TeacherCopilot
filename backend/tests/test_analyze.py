"""Analyze API 测试（Mock 模式）"""


def test_analyze_mock(client):
    """POST /api/analyze — Mock 模式应返回分类结果"""
    response = client.post(
        "/api/analyze",
        json={
            "chapter_id": "triangle",
            "chapter_name": "专题03 三角形",
            "questions": [
                {
                    "question_id": "Q001",
                    "order": 1,
                    "ocr_text": "已知AB=5，AC=8，求BC的取值范围。",
                },
                {
                    "question_id": "Q002",
                    "order": 2,
                    "ocr_text": "在△ABC中，∠A=50°，∠B=70°，求∠C。",
                },
            ],
        },
    )

    assert response.status_code == 200
    json = response.json()

    assert json["success"] is True
    assert "Mock" in json["message"]
    assert len(json["data"]["questions"]) == 2

    # 第一题应被分类为 triangle_01（三边关系）
    q1 = json["data"]["questions"][0]
    assert q1["question_type"]["id"] in [
        "triangle_01",
        "triangle_02",
        "triangle_03",
        "triangle_04",
        "triangle_05",
        "triangle_06",
        "triangle_07",
        "unknown",
    ]

    # 置信度应在 0~1 范围内
    assert 0 <= q1["confidence"]["question_type"] <= 1
    assert 0 <= q1["confidence"]["common_mistake"] <= 1
    assert 0 <= q1["confidence"]["geometry_model"] <= 1
    assert q1["teacher_note"] == ""


def test_analyze_empty(client):
    """POST /api/analyze — 空列表应正常返回"""
    response = client.post(
        "/api/analyze",
        json={
            "chapter_id": "triangle",
            "chapter_name": "专题03 三角形",
            "questions": [],
        },
    )

    assert response.status_code == 200
    json = response.json()
    assert json["success"] is True
    assert len(json["data"]["questions"]) == 0


def test_analyze_invalid_json(client):
    """POST /api/analyze — 缺少必填字段应返回 422"""
    response = client.post(
        "/api/analyze",
        json={"chapter_id": "triangle"},
    )

    assert response.status_code == 422
