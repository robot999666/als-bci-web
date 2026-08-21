from app.services.model_service import MockModelService
from app.services.signal_processor import WindowFeatures

model = MockModelService()


def _features(
    eog_p2p: float = 0.0,
    eog_blinks: float = 0.0,
    eog_drift: float = 0.0,
    eeg_var: float = 10.0,
) -> WindowFeatures:
    return WindowFeatures(
        start_offset=0.0,
        end_offset=2.0,
        eog_p2p=eog_p2p,
        eog_blinks=eog_blinks,
        eog_drift=eog_drift,
        eeg_var=eeg_var,
    )


def test_mock_model_deterministic() -> None:
    features = _features(eog_p2p=90.0, eog_blinks=2.0)
    assert model.predict(features) == model.predict(features)


def test_mock_model_rules() -> None:
    assert model.predict(_features(eog_p2p=90.0, eog_blinks=2.0)).label == "confirm"
    assert model.predict(_features(eog_p2p=50.0, eog_blinks=0.0, eog_drift=40.0)).label == "negate"
    assert model.predict(_features(eog_p2p=80.0, eog_blinks=1.0, eog_drift=3.0)).label == "sos"
    assert model.predict(_features(eog_p2p=10.0, eog_blinks=0.0, eog_drift=2.0, eeg_var=1.0)).label == "none"
    assert model.predict(_features(eog_p2p=10.0, eog_blinks=0.0, eog_drift=2.0, eeg_var=20.0)).label == "none"


def test_mock_model_confidence_bounds() -> None:
    for label in ("confirm", "negate", "sos", "none"):
        features = _features()
        prediction = model.predict(features)
        assert prediction.label_zh
        assert 0.0 <= prediction.confidence <= 1.0

