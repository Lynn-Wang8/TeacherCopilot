"""Chapter API 测试"""


def test_get_chapter_triangle(client):
    """GET /api/chapter/triangle — 应返回 200 + 题目数据"""
    response = client.get("/api/chapter/triangle")

    assert response.status_code == 200
    json = response.json()

    assert json["success"] is True
    assert json["data"]["chapter"]["id"] == "triangle"
    assert json["data"]["chapter"]["name"] == "专题03 三角形"
    assert len(json["data"]["questions"]) == 8

    # 验证题目结构
    q1 = json["data"]["questions"][0]
    assert q1["question_id"] == "Q001"
    assert q1["order"] == 1
    assert "ocr_text" in q1
    assert "question_type" in q1
    assert "common_mistake" in q1
    assert "geometry_model" in q1
    assert "confidence" in q1


def test_get_chapter_not_found(client):
    """GET /api/chapter/nonexistent — 应返回 404"""
    response = client.get("/api/chapter/nonexistent")
    assert response.status_code == 404


def test_update_question(client):
    """PUT /api/question/Q001 — 应更新题目并返回新数据"""
    response = client.put(
        "/api/question/Q001",
        json={
            "question_id": "Q001",
            "order": 1,
            "image": "",
            "ocr_text": "测试修改后的文字",
            "question_type": {
                "id": "triangle_02",
                "name": "三角形内角和与外角角度计算",
                "version": "v1",
            },
            "common_mistake": None,
            "geometry_model": None,
            "teacher_note": "测试备注",
            "confidence": {
                "question_type": 0.99,
                "common_mistake": 0,
                "geometry_model": 0,
            },
        },
    )

    assert response.status_code == 200
    json = response.json()
    assert json["success"] is True

    # 验证更新后数据
    updated = next(
        q for q in json["data"]["questions"] if q["question_id"] == "Q001"
    )
    assert updated["ocr_text"] == "测试修改后的文字"
    assert updated["teacher_note"] == "测试备注"
    assert updated["question_type"]["id"] == "triangle_02"


def test_update_question_not_found(client):
    """PUT /api/question/ZZZ999 — 应返回 404"""
    response = client.put(
        "/api/question/ZZZ999",
        json={
            "question_id": "ZZZ999",
            "order": 1,
            "image": "",
            "ocr_text": "xxx",
            "question_type": {
                "id": "triangle_01",
                "name": "三角形三边关系应用",
                "version": "v1",
            },
            "common_mistake": None,
            "geometry_model": None,
            "teacher_note": "",
            "confidence": {
                "question_type": 0.5,
                "common_mistake": 0,
                "geometry_model": 0,
            },
        },
    )

    assert response.status_code == 404
